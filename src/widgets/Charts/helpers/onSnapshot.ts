import type EChartsReact from "echarts-for-react";
import type { UterusData } from "../../../entities/detector/types/UterusData";
import type { BpmData } from "../../../entities/detector/types/BpmData";

export const onSnapshot = (
    chartRef: React.RefObject<EChartsReact>,
    snapshot: UterusData[] | BpmData[] | undefined,
    type: "bpm" | "uterus"
) => {

    const chart = chartRef.current?.getEchartsInstance();
    if (!chart || !snapshot?.length) return;

    chart.setOption({
        series: {
            data: snapshot.map((item: UterusData | BpmData) => {
                if (type === "bpm") {
                    return [item.time, (item as BpmData).bpm];
                }
                else {
                    return [item.time, (item as UterusData).uterus];
                }
            })
        }
    });
};