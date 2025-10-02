import { useCallback, useMemo, useState } from "react"
import type { Patient } from "../../../entities/patient/types/Patient"
import AppointmentSelector from "../../../features/changeAppointment/ui/AppointmentSelector"
import Flex from "../../../shared/ui/blocks/Flex"
import InfoBlock from "../../../shared/ui/blocks/InfoBlock"
import Title from "../../../shared/ui/Typography/Title"
import type { Appointment } from "../../../entities/appointment/types/Appointment"
import { timecodeToTime } from "../../../shared/lib/formatDate"
import { usePatientStore } from "../../../entities/patient/stores/usePatientStore"
import Button from "../../../shared/ui/button/Button"

const PatientAppointment: React.FC<{}> = () => {

    const patient = usePatientStore(state => state.patient)
    if (!patient) return null

    const selectedAppointment = usePatientStore(state => state.appointment)
    const setAppointment = usePatientStore(state => state.setAppointment)
    const createAppointment = usePatientStore(state => state.createAppointment)


    const onChangeSelectedId = useCallback(
        (id: number) => setAppointment(id), []
    )


    return (<>
        <Flex className="flex-col gap-10px">
            <Title order={2}>Прием</Title>
            <AppointmentSelector
                appointments={patient.appointments}
                selectedId={selectedAppointment?.id ?? 0}
                onChangeSelectedId={onChangeSelectedId}
            />
            <Flex className="flex-row gap-10px">
                {
                    selectedAppointment ?
                    <>
                        <InfoBlock value={timecodeToTime(selectedAppointment.startTime)} label="Начало" className="w-1/2" />
                        {
                            selectedAppointment.endTime ?
                                <InfoBlock value={timecodeToTime(selectedAppointment.endTime)} label="Конец" className="w-1/2" />
                                :
                                <Button className="w-1/2 h-full">
                                    <p className="p-0 m-0 font-size-16px color-#00A7B5">Завершить</p>
                                </Button>
                        }
                    </>
                    : <>
                        <Button className="w-full" onClick={createAppointment}>
                            <p className="p-0 m-0 font-size-16px color-#00A7B5">Начать прием</p>
                        </Button>
                    </> 
                }

            </Flex>
        </Flex>
    </>)
}

export default PatientAppointment