import { useEffect } from "react";
import ContentBlock from "../../../shared/ui/blocks/ContentBlock";
import Grid8x4 from "../../../shared/ui/layout/Grid8x4";
import PatientInfo from "../../../widgets/PatientInfo/ui";
import BpmChart from "../../../widgets/BpmChart/ui";
import UterusChart from "../../../widgets/UterusChart/ui";
import { useDetectorStore } from "../../../entities/detector/stores/useDetectorStore";
import { CtgLiveDetector } from "ctg-live-detector-ts";
import ChartsTooltip from "../../../widgets/ChartsTooltip/ui";
import AbnormalSegments from "../../../widgets/AbnormalSegments/ui";
import { useRoute } from "wouter";
import { usePatientStore } from "../../../entities/patient/stores/usePatientStore";
import { useWebSocket } from "../../../widgets/Charts/api/useWebSocket";

/**
 * Dashboard page that displays the patient's information, bpm chart, uterus chart, abnormal segments, and charts tooltip.
 * The page is rendered based on the patientId and appointmentId passed in the url parameters.
 * If the appointmentId is -1 or undefined, the page will not display any data.
 * If the appointmentId is valid, the page will display the patient's information, bpm chart, uterus chart, abnormal segments, and charts tooltip.
 * The page will also establish a websocket connection to receive the bpm and uterus data in real-time.
 */
const DashboardPage = () => {
    const [match, params] = useRoute("/dashboard/:patientId/:appointmentId");
    if (!match) return null;
    const patientId = Number(params?.patientId);
    const appointmentId = Number(params?.appointmentId);

    const patient = usePatientStore(state => state.patient)
    const appointment = usePatientStore(state => state.appointment)
    const setPatientId = usePatientStore(state => state.setPatientId)
    const fetchPatient = usePatientStore(state => state.fetchPatient)
    const setAppointment = usePatientStore(state => state.setAppointment)

    useEffect(() => {
        setPatientId(patientId);
        fetchPatient().then(() => {
            if (patient) {
                setAppointment(appointmentId);
            }
        });
    }, [patientId]);



    const pushBpmData = useDetectorStore(state => state.pushBpmData);
    const pushUterusData = useDetectorStore(state => state.pushUterusData);
    const setDetector = useDetectorStore(state => state.setDetector);
    const clear = useDetectorStore(state => state.clear);

    useEffect(() => {
        setDetector(new CtgLiveDetector());
        /* const fhrSocket = useWebSocketDemo(demoData.bpm, data => {
            pushBpmData(data)
        });

        const uterusSocket = useWebSocketDemo(demoData.uterus, data => {
            pushUterusData(data)
        });*/
    }, []) 

    const fhrSocket = useWebSocket("fhr", e => { e.type === 'new' ? pushBpmData({ bpm: e.item.value, time: e.item.timestamp - (appointment?.startTime || 0) }) : 0 }, {
        baseUrl: "http://localhost:5050",
        visitId: appointmentId,
        loop: true,
    });
    const uterusSocket = useWebSocket("uc", e => { e.type === 'new' ? pushUterusData({ uterus: e.item.value, time: e.item.timestamp - (appointment?.startTime || 0) }) : 0 }, {
        baseUrl: "http://localhost:5050",
        visitId: appointmentId,
        loop: true,
    }); 



    useEffect(() => {
        if (appointmentId === -1 || appointmentId === undefined) {
            fhrSocket.disconnect()
            uterusSocket.disconnect()
        }
        else {
            fhrSocket.reconnect()
            uterusSocket.reconnect()
        }
        clear()
        return () => {
            fhrSocket.disconnect()
            uterusSocket.disconnect()
        }
    }, [patientId, appointmentId])

    return (
        <Grid8x4>
            {
                patient ?
                    <PatientInfo className="col-span-2 row-span-4" />
                    : <ContentBlock className="col-span-2 row-span-4"> Loading </ContentBlock>
            }

            {
                patient ?
                    <BpmChart className="col-span-4 row-span-2" />
                    : <ContentBlock className="col-span-4 row-span-2"> Loading </ContentBlock>
            }

            {
                patient ?
                    <ChartsTooltip className="col-span-2 row-span-1" />
                    : <ContentBlock className="col-span-2 row-span-1"> Loading </ContentBlock>
            }

            {
                patient ?
                    <AbnormalSegments className="col-span-2 row-span-2" />
                    : <ContentBlock className="col-span-2 row-span-2"> Loading </ContentBlock>
            }

            {
                patient ?
                    <UterusChart className="col-span-4 row-span-2" />
                    : <ContentBlock className="col-span-4 row-span-2"> Loading </ContentBlock>
            }
            <ContentBlock className="col-span-2 row-span-1" />
        </Grid8x4>
    );
};

export default DashboardPage;