import type EChartsReact from "echarts-for-react";

/**
 * A utility function to be used in conjunction with the `dataZoom` event of ECharts.
 * It will update the `zoomRef` with the start, end, startValue, and endValue of the zoomed region.
 * @param {React.RefObject<EChartsReact>} chartRef - A reference to the ECharts React component.
 * @param {React.RefObject<{ start: number, end: number, startValue: number, endValue: number }>} zoomRef - A reference to an object that will be updated with the zoomed region.
 * @returns {dataZoom: (params: any) => void} - A function that will be called when the `dataZoom` event is triggered.
 */
export const getOnEvents = (chartRef: React.RefObject<EChartsReact>, zoomRef: React.RefObject<{ start: number, end: number, startValue: number, endValue: number }>) => {
    return {
        dataZoom: (params: any) => {
            const batch = params.batch ? params.batch[0] : params;
            const echartsInstance: any = chartRef.current?.getEchartsInstance();
            if (!echartsInstance) return;

            const seriesData: [number, number][] = echartsInstance.getOption().series[0].data as any;

            if (seriesData.length === 0) return;

            const startIndex = Math.floor(batch.start / 100 * seriesData.length);
            const endIndex = Math.floor(batch.end / 100 * seriesData.length);

            if (batch.end == 100) {
                zoomRef.current = {
                    start: batch.start,
                    end: 100,
                    startValue: seriesData[startIndex][0],
                    endValue: seriesData[seriesData.length - 1][0]
                };
            }

            else {
                zoomRef.current = {
                    start: batch.start,
                    end: batch.end,
                    startValue: seriesData[startIndex][0],
                    endValue: seriesData[endIndex][0]
                };
            }
        }
    }
}