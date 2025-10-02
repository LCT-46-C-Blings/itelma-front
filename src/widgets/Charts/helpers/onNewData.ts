import type EChartsReact from "echarts-for-react";
import type { UterusData } from "../../../entities/detector/types/UterusData";
import { lazy } from "react";
import type { BpmData } from "../../../entities/detector/types/BpmData";

export const onNewData = (
    chartRef: React.RefObject<EChartsReact>,
    newData: UterusData | BpmData | undefined,
    zoomRef: React.RefObject<{ start: number, end: number, startValue: number, endValue: number }>,
    min: number,
    max: number,
    type: "bpm" | "uterus"
) => {

    const chart = chartRef.current?.getEchartsInstance();
    if (!chart || !newData) return;

    // if (min && max) {
    //     chart.setOption({
    //         yAxis: {
    //             max: max + 10
    //         }
    //     }, {
    //         lazyUpdate: true
    //     });
    // }

    chart.appendData({
        seriesIndex: 0,
        data: [[newData.time, type === "bpm" ? (newData as BpmData).bpm : (newData as UterusData).uterus]]
    });

    chart.setOption({
        dataZoom: {
            start: zoomRef.current.start,
            end: zoomRef.current.end,
            startValue: zoomRef.current.startValue,
            endValue: zoomRef.current.end === 100 ? newData.time : zoomRef.current.endValue
        }
    }, { 
        lazyUpdate: true
    });



};