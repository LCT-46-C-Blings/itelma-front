import { useEffect, useState } from "react"
import { usePatientStore } from "../../../entities/patient/stores/usePatientStore"
import type { ContentBlockProps } from "../../../shared/ui/blocks/ContentBlock"
import ContentBlock from "../../../shared/ui/blocks/ContentBlock"
import Flex from "../../../shared/ui/blocks/Flex"
import Divider from "../../../shared/ui/Divider/Divider"
import { Select } from "../../../shared/ui/input/Select"
import Title from "../../../shared/ui/Typography/Title"
import Anamnesis from "../../Anamnesis/Anamnesis"
import PatientAppointment from "../../PatientAppointment/ui"
import ApiWrapper from "../../../shared/api/ApiWrapper"


/**
 * A component that renders a patient's information.
 * It displays the patient's id, appointment, anamnesis and an Itelma logo.
 *
 * The component accepts a className prop which is used to add additional CSS classes to the component.
 * The component renders its children inside a Flex component with a column direction.
 * The component is a wrapper around the Flex component and provides default CSS styles for the patient info block.
 * @param {ContentBlockProps} props - The props object with a className prop.
 * @returns {JSX.Element} - The rendered component.
 */
const PatientInfo: React.FC<ContentBlockProps> = ({ className, ...props }) => {
    const patient = usePatientStore(state => state.patient)
    const patientId = usePatientStore(state => state.patientId)
    const setPatientId = usePatientStore(state => state.setPatientId)

    const [patientsOptions, setPatientsOptions] = useState<any[]>([{id: -1, label: 'Новая', value: -1}])

    useEffect(() => {
        ApiWrapper.get('patients/list').then((res: any) => {
            setPatientsOptions(
                [{id: -1, label: 'Новая', value: -1}, ...res.patients.map((p: any) => ({label: `${p.id}`, value: p.id}))]
            )
        })
    }, [])

    useEffect(() => {
        if (!patient) return;
        
        const found = patientsOptions.find(p => p.value === patient?.id)
        if (!found) setPatientsOptions([...patientsOptions, {id: patient?.id, label: `${patient?.id}`, value: patient?.id}])
    }, [patient])

    return (
        <ContentBlock className={"flex flex-col justify-between h-full " + className} {...props}>
            <Flex className="flex-col gap-20px">
                <Flex className="flex-row gap-10px items-center flex-nowrap">
                    <Title order={1}>Пациентка</Title>
                    <Select className="w-full font-size-24px!" value={patientId || -1} onChange={setPatientId} options={patientsOptions}/>
                </Flex>
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