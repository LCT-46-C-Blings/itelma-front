import { create } from "zustand"
import type { Appointment } from "../../appointment/types/Appointment"
import type { BpmData } from "../../detector/types/BpmData"
import { example, type Patient } from "../types/Patient"
import ApiWrapper from "../../../shared/api/ApiWrapper"
import type { UterusData } from "../../detector/types/UterusData"

export type PatientStore = {
    patientId: number | undefined
    patient: Patient | undefined
    setPatient: (patient: Patient) => void
    setPatientId: (patientId: number) => void
    fetchPatient: () => Promise<void>

    appointment: Appointment | undefined
    setAppointment: (appointmentId: number) => void

    recordsFhr: BpmData[],
    recordsUterus: UterusData[]
    fetchRecords: () => Promise<void>

    createAppointment: () => Promise<void>
}

export const usePatientStore = create<PatientStore>((set, get) => ({
    patientId: undefined,
    patient: example,
    setPatient: (patient: Patient) => set({ patient }),
    setPatientId: (patientId: number) => set({ patientId }),
    fetchPatient: async () => {
        const patient = await ApiWrapper.get<any>(`patients?patient_id=${get().patientId}`)
        set({
            patient: 'patient' in patient ? {
                anamnesis: patient.patient.anamnesis,
                appointments: patient.patient.appointments.map((a: any) => ({ id: a.id, startTime: a.start_time, endTime: a.end_time }))
            } as any : patient
        })
    },

    appointment: undefined,
    setAppointment: (appointmentId: number) => {
        const patient = get().patient;
        if (patient === undefined) set({ appointment: undefined });
        else {
            const appointment = patient.appointments.find(a => a.id === appointmentId);
            if (appointment === undefined) set({ appointment: undefined });
            else set({ appointment }) 
        }

    },

    recordsFhr: [],
    recordsUterus: [],
    fetchRecords: async () => {
        const visitId = get().appointment?.id;
        if (visitId === undefined) return;

        const bpmResponse = await ApiWrapper.get<{ items: { timestamp: number, value: number }[] }>(`records/${visitId}/bpm`)
        const bpm = bpmResponse.items.map(item => ({ time: item.timestamp, bpm: item.value }))

        const uterusResponse = await ApiWrapper.get<{ items: { timestamp: number, value: number }[] }>(`records/${visitId}/uterus`)
        const uterus = uterusResponse.items.map(item => ({ time: item.timestamp, uterus: item.value }))

        set({ recordsFhr: bpm, recordsUterus: uterus })
    },

    createAppointment: async () => {
        const patient = get().patient;
        if (!patient) return;
        const visit = await ApiWrapper.post<any>(`visits/create?patient_id=${patient.id}`, {})
        if (visit.created) {
            set({ 
                appointment: { id: visit.id, startTime: Date.now(), endTime: undefined },
                patient: { ...patient, appointments: [...patient.appointments, { id: visit.id, startTime: Date.now(), endTime: undefined }] }
            })

        }
    } 
}))