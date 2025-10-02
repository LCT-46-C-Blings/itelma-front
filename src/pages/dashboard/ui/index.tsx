import { useCallback, useEffect, useRef } from "react";
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
import { useWebSocket, type IncomingEvent } from "../../../widgets/Charts/api/useWebSocket";
import type { Socket } from "socket.io-client";
import Prediction from "../../../widgets/Prediction/ui";
import ApiWrapper from "../../../shared/api/ApiWrapper";

/**
 * Dashboard page that displays the patient's information, bpm chart, uterus chart, abnormal segments, and charts tooltip.
 * The page is rendered based on the patientId and appointmentId passed in the url parameters.
 * If the appointmentId is -1 or undefined, the page will not display any data.
 * If the appointmentId is valid, the page will display the patient's information, bpm chart, uterus chart, abnormal segments, and charts tooltip.
 * The page will also establish a websocket connection to receive the bpm and uterus data in real-time.
 */
const DashboardPage = () => {

    const renderCount = useRef(0);
    renderCount.current++;

    const [match, params] = useRoute("/dashboard/:patientId/:appointmentId");
    if (!match) {
        history.replaceState({}, '', `/dashboard/-1/-1`);
    };
    const patientId = Number(params?.patientId || -1);
    const appointmentId = Number(params?.appointmentId || -1);

    const patient = usePatientStore(state => state.patient)
    const appointment = usePatientStore(state => state.appointment)
    const setPatientId = usePatientStore(state => state.setPatientId)
    const setAppointment = usePatientStore(state => state.setAppointment)

    // console.log(patient, appointment, patientId, appointmentId)

    useEffect(() => {
        setPatientId(patientId).then(() => {
            if (patient) {
                setAppointment(appointmentId);
            }
        });
    }, [patientId]);


    const loadBpmSnapshot = useDetectorStore(state => state.loadBpmSnapshot);
    const loadUterusSnapshot = useDetectorStore(state => state.loadUterusSnapshot);
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

    useEffect(() => {
        if (!appointment) return;
        ApiWrapper.get<{items: {timestamp: number, value: number}[]}>(`records/fhr?visit_id=${appointment?.id}`).then(data => {
            loadBpmSnapshot(data.items.map(it => ({
                bpm: it.value, time: it.timestamp - startOffsetRef.current
            })));
        });

        ApiWrapper.get<{items: {timestamp: number, value: number}[]}>(`records/uc?visit_id=${appointment?.id}`).then(data => {
            loadUterusSnapshot(data.items.map(it => ({
                uterus: it.value, time: it.timestamp - startOffsetRef.current
            })));
        })
    }, [appointment?.id])

    const startOffsetRef = useRef(0);
    useEffect(() => {
        startOffsetRef.current = appointment?.startTime ?? 0;
    }, [appointment?.startTime]);

    const handleFhrEvent = useCallback((e: IncomingEvent) => {
        if (e.type === "snapshot") {
            // console.log("fhr snapshot", e)
            loadBpmSnapshot(e.items.map(it => ({
                bpm: it.value, time: it.timestamp - startOffsetRef.current
            })));
        } else if (e.type === "new") {
            // console.log("fhr new", e)
            pushBpmData({ bpm: e.item.value, time: e.item.timestamp - startOffsetRef.current });
        }
        else {
            // console.log("fhr", e)
        }
    }, [loadBpmSnapshot, pushBpmData]);

    const handleUcEvent = useCallback((e: IncomingEvent) => {
        if (e.type === "snapshot") {
            // console.log("uc snapshot", e)
            loadUterusSnapshot(e.items.map(it => ({
                uterus: it.value, time: it.timestamp - startOffsetRef.current
            })));
        } else if (e.type === "new") {
            // console.log("uc new", e)
            pushUterusData({ uterus: e.item.value, time: e.item.timestamp - startOffsetRef.current });
        }
        else {
            // console.log("uc", e)
        }
    }, [loadUterusSnapshot, pushUterusData]);

    const fhrSocketRef = useRef<Socket | null>(null);
    const uterusSocketRef = useRef<Socket | null>(null);

    const fhrSocket = useWebSocket("fhr", handleFhrEvent, {
        baseUrl: "http://localhost:5050",
        visitId: appointmentId,
        loop: true,
    });
    const uterusSocket = useWebSocket("uc", handleUcEvent, {
        baseUrl: "http://localhost:5050",
        visitId: appointmentId,
        loop: true,
    });

    fhrSocketRef.current = fhrSocket.socketRef.current
    uterusSocketRef.current = uterusSocket.socketRef.current





    useEffect(() => {
        // console.log("ID", fhrSocketRef, appointmentId)
        if (!fhrSocketRef.current || !uterusSocketRef.current) return

        if (appointmentId === -1 || appointmentId === undefined) {
            fhrSocketRef.current.disconnect()
            uterusSocketRef.current.disconnect()
        }
        else {
            fhrSocketRef.current.connect()
            uterusSocketRef.current.connect()
        }
        clear()
        return () => {
            if (!fhrSocketRef.current || !uterusSocketRef.current) return
            fhrSocketRef.current.disconnect()
            uterusSocketRef.current.disconnect()
        }
    }, [patientId, appointmentId])

    return (
        <Grid8x4>

            <PatientInfo className="col-span-2 row-span-4" />

            {
                patient && appointment ?
                    <BpmChart className="col-span-4 row-span-2" />
                    : <ContentBlock className="col-span-4 row-span-2"> Начните прием </ContentBlock>
            }

            {
                patient && appointment ?
                    <ChartsTooltip className="col-span-2 row-span-1" />
                    : <ContentBlock className="col-span-2 row-span-1"> Начните прием </ContentBlock>
            }

            {
                patient && appointment ?
                    <AbnormalSegments className="col-span-2 row-span-2" />
                    : <ContentBlock className="col-span-2 row-span-2"> Начните прием </ContentBlock>
            }

            {
                patient && appointment ?
                    <UterusChart className="col-span-4 row-span-2" />
                    : <ContentBlock className="col-span-4 row-span-2"> Начните прием </ContentBlock>
            }

            {
                patient && appointment ?
                    <Prediction className="col-span-2 row-span-1" />
                    : <ContentBlock className="col-span-2 row-span-1"> Начните прием </ContentBlock>
            }
        </Grid8x4>
    );
};

export default DashboardPage;