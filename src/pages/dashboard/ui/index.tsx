import { useEffect, useState } from "react";
import ContentBlock from "../../../shared/ui/blocks/ContentBlock";
import Grid8x4 from "../../../shared/ui/layout/Grid8x4";
import PatientInfo from "../../../widgets/PatientInfo/ui";
import { example, type Patient } from "../../../entities/patient/types/Patient";

const DashboardPage = () => {
    const [patient, setPatient] = useState<Patient | null | undefined>(undefined);

    useEffect(() => {
        setPatient(example)
    }, []);

    return (
        <Grid8x4>
            {
                patient ?
                    <PatientInfo patient={patient} className="col-span-2 row-span-4" />
                    : <ContentBlock className="col-span-2 row-span-4"> Loading </ContentBlock>
            }


            <ContentBlock className="col-span-4 row-span-2" />
            <ContentBlock className="col-span-2 row-span-2" />
            <ContentBlock className="col-span-4 row-span-2" />
            <ContentBlock className="col-span-2 row-span-2" />
        </Grid8x4>
    );
};

export default DashboardPage;