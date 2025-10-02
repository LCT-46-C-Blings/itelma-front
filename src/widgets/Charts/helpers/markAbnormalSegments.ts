import type EChartsReact from "echarts-for-react";
import type { BpmData } from "../../../entities/detector/types/BpmData";
import { formatDiagnosis, type FhrSegment, type UterusSegment } from "ctg-live-detector-ts";
import type { UterusData } from "../../../entities/detector/types/UterusData";

/**
 * Marks an abnormal segment on the chart.
 *
 * @param {React.RefObject<EChartsReact>} chartRef - The reference to the ECharts instance.
 * @param {FhrSegment | UterusSegment} segment - The abnormal segment to mark.
 * @param {BpmData[] | UterusData[]} data - The data points that make up the chart.
 * @param {"bpm" | "uterus"} type - The type of chart.
 */
export const markAbnormalSegments = (
    chartRef: React.RefObject<EChartsReact>,
    segment: FhrSegment | UterusSegment,
    data: BpmData[] | UterusData[],
    type: "bpm" | "uterus"
) => {

    const chart = chartRef.current?.getEchartsInstance();
    if (!chart) return;

    if (type === "bpm") {
        chart.appendData({
            seriesIndex: 1,
            data: [...((data as BpmData[]).map((d: BpmData) => [d.time, d.bpm])), [segment.startTime, null], [segment.endTime, null]]
        });
    }
    else {
        chart.appendData({
            seriesIndex: 1,
            data: [...((data as UterusData[]).map((d: UterusData) => [d.time, d.uterus])), [segment.startTime, null], [segment.endTime, null]]
        })
    }

    const opt = chart.getOption();
    const currentPieces = (opt.visualMap as any)[0].pieces || [];
    const s = (opt.series as any || []).find((x: any) => x.id === 'diagnosis');
    const currentAreas = s?.markArea?.data || [];

    console.log(segment)
    console.log(data)
    console.log(opt)
    chart.setOption({
        visualMap: {
            pieces: [
                ...currentPieces,
                {
                    min: segment.startTime,
                    max: segment.endTime,
                    color: '#00A7B580'
                }
            ]
        },
        series: [{
            id: 'diagnosis',
            markArea: {
                data: [
                    ...currentAreas,
                    [
                        {
                            name: formatDiagnosis(segment),
                            xAxis: segment.startTime,
                            yAxis: type === "bpm" ? 70 : 10
                        },
                        {
                            xAxis: segment.endTime,
                            yAxis: type === "bpm" ? 70 : 10
                        }
                    ]
                ],
            }
        }]
    }, { lazyUpdate: true });
};