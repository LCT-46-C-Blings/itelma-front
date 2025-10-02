import { usePatientStore } from "../../../entities/patient/stores/usePatientStore"
import type { Patient } from "../../../entities/patient/types/Patient"
import type { ContentBlockProps } from "../../../shared/ui/blocks/ContentBlock"
import ContentBlock from "../../../shared/ui/blocks/ContentBlock"
import Flex from "../../../shared/ui/blocks/Flex"
import Divider from "../../../shared/ui/Divider/Divider"
import Title from "../../../shared/ui/Typography/Title"
import Anamnesis from "../../Anamnesis/Anamnesis"
import PatientAppointment from "../../PatientAppointment/ui"

const PatientInfo: React.FC<ContentBlockProps> = ({ className, ...props }) => {
    const patient = usePatientStore(state => state.patient)
    if (!patient) return null

    return (
        <ContentBlock className={"flex flex-col justify-between h-full " + className} {...props}>
            <Flex className="flex-col gap-20px">
                <Title order={1}>Пациентка {patient.id}</Title>
                <Divider />
                <PatientAppointment />
                <Divider />
                <Anamnesis />
            </Flex>

            <div className="justify-self-end">
                <img src="/itelma-logo.svg" alt="Itelma Logo" className="h-20px" />
            </div>
        </ContentBlock>
    )
}

export default PatientInfo