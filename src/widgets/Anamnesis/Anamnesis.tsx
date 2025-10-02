import { useEffect, useMemo, useState } from "react"
import { usePatientStore } from "../../entities/patient/stores/usePatientStore"
import Flex from "../../shared/ui/blocks/Flex"
import ScrollBox from "../../shared/ui/blocks/ScrollBox"
import Title from "../../shared/ui/Typography/Title"
import TextInput from "../../shared/ui/input/TextInput"

/**
 * Component for displaying a list of anamnesis from a patient
 * @returns A Flex component containing a Title and a ScrollBox with a list of anamnesis
 */
const AnamnesisItem: React.FC<{
    value: string
    onChange?: (v: string) => void
    onRemove?: () => void
    editable?: boolean
}> = (props) => {

    return (
        <Flex className="flex-row flex-nowrap justify-between items-center">
            <TextInput className="w-full" value={props.value} onChange={props.onChange} placeholder="Введите диагноз" disabled={!props.editable} />
            {props.editable && props.value !== "" &&
                <button
                    onClick={props.onRemove}
                    className="p-0 m-0 text-#00000080 font-size-16px bg-transparent lh-16px cursor-pointer outline-none border-none"
                >
                    X
                </button>
            }
        </Flex>
    )
}

const Anamnesis: React.FC<{}> = () => {

    const patient = usePatientStore(state => state.patient)
    const appointment = usePatientStore(state => state.appointment)
    const updateAnamnesis = usePatientStore(state => state.updateAnamnesis)
    const createPatient = usePatientStore(state => state.createPatient)
    const setNewAnamnesisStore = usePatientStore(state => state.setNewAnamnesis)

    const [newAnamnesis, setNewAnamnesis] = useState<string[]>(patient?.anamnesis || [])
    const [editable, setEditable] = useState(appointment === undefined || appointment.id === -1)

    const anamnesis = useMemo(() => {
        // console.log("ANAMNESIS", patient)
        if (patient) {
            setNewAnamnesis(patient.anamnesis)
            return patient.anamnesis
        }
        else {
            setNewAnamnesis([])
            return []
        }
    }, [patient, patient?.anamnesis])

    const onSave = () => {
        if (!patient) {
            if (newAnamnesis.length === 0) return
            createPatient(newAnamnesis)
            return;
        }
        let needSave = false;
        if (newAnamnesis.length === patient.anamnesis.length) {
            for (let i = 0; i < newAnamnesis.length; i++) {
                if (newAnamnesis[i] !== patient.anamnesis[i]) {
                    needSave = true
                    break;
                }
            }
        }
        else {
            needSave = true
        }
        if (needSave) {
            // console.log(newAnamnesis, patient.anamnesis, needSave)
            updateAnamnesis(newAnamnesis)
        }

    }

    const onChange = (i: number, v: string) => {
        if (!v || v === "") return
        const newAnamnesis = [...anamnesis]
        newAnamnesis[i] = v
        setNewAnamnesis(newAnamnesis)
        setNewAnamnesisStore(newAnamnesis)
    }

    const onRemove = (i: number) => {
        // console.log(i)
        setNewAnamnesis(newAnamnesis.filter((_, index) => index !== i))
    }

    useEffect(() => {
        onSave()
    }, [newAnamnesis])

    useEffect(() => {
        setEditable(appointment === undefined || appointment.id === -1)
    }, [appointment])

    const EmptyField = () => <AnamnesisItem value="" onChange={(v) => { if (v) { setNewAnamnesis([...newAnamnesis, v]); } }} editable={editable} />

    return (
        <Flex className="flex-col gap-10px">
            <Title order={2}>Анамнез</Title>
            <ScrollBox className={"h-[calc(100vh-128px-95px-400px-20px)]"}>
                {
                    newAnamnesis.map((a, i) => <AnamnesisItem key={i} value={a} onChange={(v) => onChange(i, v)} editable={editable} onRemove={() => onRemove(i)} />)
                }
                {editable && <EmptyField />}
            </ScrollBox>
        </Flex>
    )
}

export default Anamnesis