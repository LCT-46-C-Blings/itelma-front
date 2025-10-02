import { useEffect, useState } from "react";
import ApiWrapper from "../../../shared/api/ApiWrapper";

export const usePrediction = (visitId: number) => {
    const [prediction, setPrediction] = useState<{ id: number, result: string } | null>(null);

    useEffect(() => {
        ApiWrapper.get<{ id: number, result: string }>(`visits/prediction?visit_id=${visitId}`).then((data) => {
            setPrediction(data);
        });
    }, [visitId]);

    return prediction;
}
