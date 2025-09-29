import type { Patient } from "../../../entities/patient/types/Patient"
import type { ContentBlockProps } from "../../../shared/blocks/ContentBlock"
import ContentBlock from "../../../shared/blocks/ContentBlock"
import Divider from "../../../shared/Divider/Divider"
import Title from "../../../shared/Typography/Title"
import PatientAppointment from "../../PatientAppointment/ui"

const PatientInfo: React.FC<ContentBlockProps & {
    patient: Patient
}> = ({ patient, ...props }) => {
    return (
        <ContentBlock {...props}>
            <Title order={1}>Пациентка {patient.id}</Title>
            <Divider />
            <PatientAppointment patient={patient} />
        </ContentBlock>
    )
}

export default PatientInfo