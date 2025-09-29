import type { Patient } from "../../../entities/patient/types/Patient"
import AppointmentSelector from "../../../features/changeAppointment/ui/AppointmentSelector"
import Flex from "../../../shared/blocks/Flex"
import Title from "../../../shared/Typography/Title"

const PatientAppointment: React.FC<{
    patient: Patient
}> = ({ patient }) => {
    return (<>
        <Flex className="flex-col gap-10px">
            <Title order={2}>Прием</Title>
            <AppointmentSelector appointments={patient.appointments} />
        </Flex>
    </>)
}

export default PatientAppointment