import { useEffect, useState } from "react";
import ContentBlock from "../../../shared/ui/blocks/ContentBlock";
import Grid8x4 from "../../../shared/ui/layout/Grid8x4";
import PatientInfo from "../../../widgets/PatientInfo/ui";
import { example, type Patient } from "../../../entities/patient/types/Patient";
import BpmChart from "../../../widgets/BpmChart/ui";
import UterusChart from "../../../widgets/UterusChart/ui";
import { useWebSocketDemo } from "../../../shared/hooks/useWebSocket";
import { demoData } from "../../../widgets/BpmChart/api/sample";
import { useDetectorStore } from "../../../entities/detector/stores/useDetectorStore";
import type { BpmData } from "../../../entities/detector/types/BpmData";
import type { UterusData } from "../../../entities/detector/types/UterusData";
import { CtgLiveDetector } from "ctg-live-detector-ts";
import ChartsTooltip from "../../../widgets/ChartsTooltip/ui";
import AbnormalSegments from "../../../widgets/AbnormalSegments/ui";

const DashboardPage = () => {
    const [patient, setPatient] = useState<Patient | null | undefined>(undefined);

    useEffect(() => {
        setPatient(example)
    }, []);

    const pushBpmData = useDetectorStore(state => state.pushBpmData);
    const pushUterusData = useDetectorStore(state => state.pushUterusData);
    const setDetector = useDetectorStore(state => state.setDetector);

    useEffect(() => {
        setDetector(new CtgLiveDetector());
        useWebSocketDemo(demoData.bpm, data => pushBpmData(data as BpmData));
        useWebSocketDemo(demoData.uterus, data => pushUterusData(data as UterusData));
    }, [])

    return (
        <Grid8x4>
            {
                patient ?
                    <PatientInfo patient={patient} className="col-span-2 row-span-4" />
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