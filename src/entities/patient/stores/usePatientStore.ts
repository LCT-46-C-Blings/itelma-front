import { create } from "zustand"
import type { Appointment } from "../../appointment/types/Appointment"
import type { BpmData } from "../../detector/types/BpmData"
import { type Patient } from "../types/Patient"
import ApiWrapper from "../../../shared/api/ApiWrapper"
import type { UterusData } from "../../detector/types/UterusData"

export type PatientStore = {
    patientId: number | undefined
    patient: Patient | undefined
    setPatient: (patient: Patient) => void
    setPatientId: (patientId: number) => Promise<void>
    fetchPatient: () => Promise<void>

    appointment: Appointment | undefined
    setAppointment: (appointmentId: number) => void

    recordsFhr: BpmData[],
    recordsUterus: UterusData[]
    fetchRecords: () => Promise<void>

    createAppointment: (reload?: boolean) => Promise<void>
    completeAppointment: () => Promise<void>

    newAnamnesis: string[]
    setNewAnamnesis: (anamnesis: string[]) => void
    updateAnamnesis: (anamnesis: string[]) => Promise<void>
    createPatient: (anamnesis: string[]) => Promise<void>
}

export const usePatientStore = create<PatientStore>((set, get) => ({
    patientId: -1,
    patient: undefined,
    setPatient: (patient: Patient) => set({ patient }),
    setPatientId: async (patientId: number) => {
        if (get().patientId === patientId) return
        set({ patientId })
        if (patientId !== -1) await get().fetchPatient()
        else {
            set({ patient: undefined, appointment: undefined })
        }
        
        history.replaceState({}, '', `/dashboard/${patientId}/-1`)
    },
    /**
     * Fetches the patient data from the server and updates the state.
     * If the patient is found, it updates the state with the patient's data.
     * If the patient is not found, it sets the state to undefined.
     * @returns {Promise<void>} A promise that resolves when the data is fetched.
     */
    fetchPatient: async () => {
        if (get().patientId === undefined || get().patientId === -1) return;
        const patient = await ApiWrapper.get<any>(`patients?patient_id=${get().patientId}`)
        set({
            patient: 'patient' in patient ? {
                id: patient.patient.id,
                anamnesis: patient.patient.anamnesis,
                appointments: patient.patient.appointments.map((a: any) => ({ id: a.id, startTime: a.start_time, endTime: a.end_time }))
            } as any : patient
        })
    },

    appointment: undefined,
    /**
     * Sets the appointment state to the appointment with the given id.
     * If the patient state is undefined, it sets the appointment state to undefined.
     * If the patient state is defined and the appointment is not found, it sets the appointment state to undefined.
     * @param {number} appointmentId - The id of the appointment to set.
     */
    setAppointment: (appointmentId: number) => {
        const patient = get().patient;
        if (patient === undefined) set({ appointment: undefined });
        else {
            const appointment = patient.appointments.find(a => a.id === appointmentId);
            if (appointment === undefined) {
                set({ appointment: undefined })
                history.replaceState({}, '', `/dashboard/${get().patientId}/-1`)
                return;
            }
            else set({ appointment })
        }
        history.replaceState({}, '', `/dashboard/${get().patientId}/${appointmentId}`)
    },

    recordsFhr: [],
    recordsUterus: [],
    /**
     * Fetches the records data from the server and updates the state.
     * If the appointment state is undefined, it does not make any requests and does not update the state.
     * If the appointment state is defined, it makes two requests to the server: one for the bpm records and one for the uterus records.
     * The requests are made with the visit id from the appointment state.
     * The responses are mapped to the recordsFhr and recordsUterus states respectively.
     * @returns {Promise<void>} A promise that resolves when the data is fetched.
     */
    fetchRecords: async (): Promise<void> => {
        const visitId = get().appointment?.id;
        if (visitId === undefined) return;

        const bpmResponse = await ApiWrapper.get<{ items: { timestamp: number, value: number }[] }>(`records/${visitId}/bpm`)
        const bpm = bpmResponse.items.map(item => ({ time: item.timestamp, bpm: item.value }))

        const uterusResponse = await ApiWrapper.get<{ items: { timestamp: number, value: number }[] }>(`records/${visitId}/uterus`)
        const uterus = uterusResponse.items.map(item => ({ time: item.timestamp, uterus: item.value }))

        set({ recordsFhr: bpm, recordsUterus: uterus })
    },

    /**
     * Creates a new appointment for the current patient.
     * If the patient state is undefined, it does not make any requests and does not update the state.
     * If the patient state is defined, it makes a request to the server to create a new appointment with the patient id.
     * If the appointment is created successfully, it updates the appointment state to the new appointment.
     * It also updates the patient state by adding the new appointment to the patient's appointments array.
     * @returns {Promise<void>} A promise that resolves when the data is fetched.
     */
    createAppointment: async (reload: boolean = false): Promise<void> => {
        const patient = get().patient;
        if (reload && !patient) {
            // console.log("No patient", reload)
            return
        }
        else if (!patient) {
            // console.log('try to get')
            await get().createPatient(get().newAnamnesis);
            get().createAppointment(true);
            return;
        };
        // console.log(patient)
        const visit = await ApiWrapper.post<any>(`visits/create?patient_id=${patient.id}`, {})
        if (visit.created) {
            set({
                appointment: { id: visit.visit_id, startTime: Date.now() / 1000, endTime: undefined },
                patient: { ...patient, appointments: [...patient.appointments, { id: visit.visit_id, startTime: Date.now() / 1000, endTime: undefined }] }
            })
            history.replaceState({}, '', `/dashboard/${get().patientId}/${visit.visit_id}`)
        }
    },

    completeAppointment: async (): Promise<void> => {
        const visit = get().appointment;
        if (!visit) return;
        await ApiWrapper.post<any>(`visits/finish?visit_id=${visit.id}`, {})
        set({
            appointment: {
                id: visit.id,
                startTime: visit.startTime,
                endTime: Date.now() / 1000
            }
        })
    },


    newAnamnesis: [],
    setNewAnamnesis: (anamnesis: string[]) => {
        set({ newAnamnesis: anamnesis })
    },


    updateAnamnesis: async (anamnesis: string[]) => {
        const patient = get().patient;
        if (!patient) return;
        await ApiWrapper.post('patients/set_anamnesis?patient_id=' + patient.id, { anamnesis })
    },


    createPatient: async (anamnesis: string[]) => {
        const patient = await ApiWrapper.post<any>(`patients/create`, { anamnesis })
        await get().setPatientId(patient.patient_id)
    }
}))