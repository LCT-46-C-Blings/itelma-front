import type { Patient } from "../../../entities/patient/types/Patient"
import type { ContentBlockProps } from "../../../shared/ui/blocks/ContentBlock"
import ContentBlock from "../../../shared/ui/blocks/ContentBlock"
import Flex from "../../../shared/ui/blocks/Flex"
import Divider from "../../../shared/ui/Divider/Divider"
import Title from "../../../shared/ui/Typography/Title"
import Anamnesis from "../../Anamnesis/Anamnesis"
import PatientAppointment from "../../PatientAppointment/ui"

const PatientInfo: React.FC<ContentBlockProps & {
    patient: Patient
}> = ({ patient, className, ...props }) => {
    return (
        <ContentBlock className={"flex flex-col justify-between h-full " + className} {...props}>
            <Flex className="flex-col gap-20px">
                <Title order={1}>Пациентка {patient.id}</Title>
                <Divider />
                <PatientAppointment patient={patient} />
                <Divider />
                <Anamnesis anamnesis={patient.anamnesis} />
            </Flex>

            <div className="justify-self-end">
                <img src="/itelma-logo.svg" alt="Itelma Logo" className="h-20px" />
            </div>
        </ContentBlock>
    )
}

export default PatientInfo