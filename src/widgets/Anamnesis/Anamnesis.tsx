import { useMemo } from "react"
import { usePatientStore } from "../../entities/patient/stores/usePatientStore"
import Flex from "../../shared/ui/blocks/Flex"
import ScrollBox from "../../shared/ui/blocks/ScrollBox"
import Title from "../../shared/ui/Typography/Title"

/**
 * Component for displaying a list of anamnesis from a patient
 * @returns A Flex component containing a Title and a ScrollBox with a list of anamnesis
 */
const Anamnesis: React.FC<{}> = () => {

    const patient = usePatientStore(state => state.patient)
    if (!patient) return null

    const anamnesis = useMemo(() => patient.anamnesis, [patient.anamnesis])

    return (
        <Flex className="flex-col gap-10px">
            <Title order={2}>Анамнез</Title>
            <ScrollBox className={"h-[calc(100vh-128px-95px-400px-20px)]"} children={anamnesis.map((a, i) =>
                <>
                    <p key={i} className="p-0 m-0 font-size-16px">
                        {a}
                    </p>
                </>
            )} />
        </Flex>
    )
}

export default Anamnesis