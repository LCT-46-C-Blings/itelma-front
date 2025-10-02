import { useEffect, useState } from "react"
import { usePatientStore } from "../../../entities/patient/stores/usePatientStore"
import ContentBlock from "../../../shared/ui/blocks/ContentBlock"
import Divider from "../../../shared/ui/Divider/Divider"
import Title from "../../../shared/ui/Typography/Title"
import ApiWrapper from "../../../shared/api/ApiWrapper"
import InfoBlock from "../../../shared/ui/blocks/InfoBlock"

type PredictionType = {
    id: number,
    result: {
        clinical_statistics: {
            acceleration: {
                count: 0,
                max_height_bpm: 0,
                segments: [],
                total_seconds: 0
            },
            bradycardia: {
                detected: false,
                segments: [],
                segments_count: 0,
                total_seconds: 0
            },
            contractions_and_decelerations: {
                contraction_count: 0,
                contraction_segments: [],
                decelerations_after_contractions: 0,
                total_seconds: 0
            },
            deceleration: {
                count: 0,
                max_drop_bpm: 0,
                percentage: 0,
                segments: [],
                total_seconds: 0
            },
            heart_rate_variability: {
                absent_variability: false,
                decreased_variability: false,
                long_term: 26.517773561569097,
                short_term: 0
            },
            non_stress_test: {
                acceleration_count: 0,
                reactive: false
            },
            oxytocin_stress_test: {
                positive: false,
                stress_test_positive: false,
                uterine_data_available: true
            },
            sawtooth_rhythm: {
                detected: false,
                index: 1.2296213619958518
            },
            sinusoidal_rhythm: {
                detected: false,
                index: 0.15288185623025047
            },
            tachycardia: {
                detected: false,
                segments: [],
                segments_count: 0,
                total_seconds: 0
            }
        },
        hypoxia_probability: 0.30091228070175435
    }
}

const Prediction: React.FC<{
    className?: string
}> = (props) => {

    const [prediction, setPrediction] = useState<PredictionType | null>(null);
    const appointment = usePatientStore(state => state.appointment);

    useEffect(() => {
        if (!appointment || !appointment.endTime) return;
        ApiWrapper.get<{ prediction: PredictionType }>(`predictions?visit_id=${appointment.id}`).then((data) => {
            setPrediction(data.prediction);
            // console.log(data.prediction);
        });

    }, [appointment, appointment?.id, appointment?.endTime]);

    return (
        <ContentBlock className={"flex flex-col overflow-y-scroll overflow-x-hidden pt-20px! pb-20px! px-20px! gap-10px! " + props.className}>
            <Title order={2} className="ml-10px mt-10px">Прогноз</Title>
            <Divider />

            {
                appointment?.endTime ? (
                    <InfoBlock
                        value={
                            (() => {
                                if (!prediction) return "? %"
                                return `${(prediction.result.hypoxia_probability * 100).toFixed(2)}%`
                            })()
                        }
                        label="Вероятность гипоксии" />

                ) : (
                    <p className="ml-10px mt-10px fz-16px">Прогноз станет известен после конца приема</p>
                )
            }
        </ContentBlock>
    )
}

export default Prediction