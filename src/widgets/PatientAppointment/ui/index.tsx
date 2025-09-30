import { useCallback, useMemo, useState } from "react"
import type { Patient } from "../../../entities/patient/types/Patient"
import AppointmentSelector from "../../../features/changeAppointment/ui/AppointmentSelector"
import Flex from "../../../shared/ui/blocks/Flex"
import InfoBlock from "../../../shared/ui/blocks/InfoBlock"
import Title from "../../../shared/ui/Typography/Title"
import type { Appointment } from "../../../entities/appointment/types/Appointment"
import { timecodeToTime } from "../../../shared/lib/formatDate"

const PatientAppointment: React.FC<{
    patient: Patient
}> = ({ patient }) => {

    const [selectedId, setSelectedId] = useState(patient.appointments[0].id);

    const selectedAppointment = useMemo(
        () => patient.appointments.find((a) => a.id === selectedId)!,
        [patient.appointments, selectedId]
    )

    const onChangeSelectedId = useCallback(
        (id: number) => setSelectedId(id), []
    )

    return (<>
        <Flex className="flex-col gap-10px">
            <Title order={2}>Прием</Title>
            <AppointmentSelector
                appointments={patient.appointments}
                selectedId={selectedId}
                onChangeSelectedId={onChangeSelectedId}
            />
            <Flex className="flex-row gap-10px">
                <InfoBlock value={timecodeToTime(selectedAppointment.startTime / 1000)} label="Начало" className="w-1/2" />
                <InfoBlock value={timecodeToTime(selectedAppointment.endTime / 1000)} label="Конец" className="w-1/2" />
            </Flex>
        </Flex>
    </>)
}

export default PatientAppointment