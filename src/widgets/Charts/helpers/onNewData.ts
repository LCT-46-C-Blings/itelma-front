import type EChartsReact from "echarts-for-react";
import type { UterusData } from "../../../entities/detector/types/UterusData";
import type { BpmData } from "../../../entities/detector/types/BpmData";

/**
 * Updates the chart with new data.
 * If the new data is not undefined, it will append the new data to the chart.
 * It will also update the zoomRef with the start, end, startValue, and endValue of the zoomed region.
 * @param {React.RefObject<EChartsReact>} chartRef - A reference to the ECharts React component.
 * @param {(UterusData | BpmData) | undefined} newData - The new data to append to the chart.
 * @param {React.RefObject<{ start: number, end: number, startValue: number, endValue: number }>} zoomRef - A reference to an object that will be updated with the zoomed region.
 * @param {"bpm" | "uterus"} type - The type of the new data.
 */
export const onNewData = (
    chartRef: React.RefObject<EChartsReact>,
    newData: UterusData | BpmData | undefined,
    zoomRef: React.RefObject<{ start: number, end: number, startValue: number, endValue: number }>,
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