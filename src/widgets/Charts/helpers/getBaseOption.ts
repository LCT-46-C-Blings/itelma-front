import { graphic, throttle } from "echarts";
import { formatUterusTime } from "../../UterusChart/helpers/formatters";
import { formatBpmTime } from "../../BpmChart/helpers/formatters";

export function getBaseOption(type: "bpm" | "uterus") {
    return {
        animation: false,
        tooltip: {
            trigger: "axis",
            formatter: type === "bpm" ? formatBpmTime : formatUterusTime
        },
        xAxis: {
            type: "value",
            show: true,
            min: 0,
            startValue: 0,
            axisLine: {
                show: false
            },
            maxInterval: 60,
            minInterval: 1,
            axisTick: { show: false },
            splitLine: {
                lineStyle: { color: "rgba(0, 167, 181, 0.13)" }
            },
            axisLabel: {
                inside: true,
                showMaxLabel: false,
                showMinLabel: false,
                fontFamily: "Gilroy",
                color: "#00A7B5",
            }
        },
        yAxis: {
            type: "value",
            show: true,
            axisLine: {
                show: false
            },
            min: type === "bpm" ? 60 : 0,
            max: type === "bpm" ? (value: any) => Math.max(value.max + 30, value.max) : undefined,
            interval: 10,
            splitLine: {
                lineStyle: { color: "rgba(0, 167, 181, 0.13)" }
            },
            axisTick: { show: false },
            axisLabel: {
                inside: true,
                showMaxLabel: false,
                showMinLabel: false,
                fontFamily: "Gilroy",
                color: "rgba(0, 167, 181, 1)",
            },
            z: 200
        },
        visualMap: {
            type: 'piecewise',
            show: false,
            dimension: 0,
            seriesIndex: 1,
            pieces: []
        },
        series: [
            {

                name: type === "bpm" ? "Пульс" : "Схватки",
                type: "line",
                data: [],
                xAxisIndex: 0,
                yAxisIndex: 0,
                symbol: "none",
                lineStyle: { color: "rgba(0, 167, 181, 1)", width: 2 },
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(0, 167, 181, 0.5)" },
                        { offset: 1, color: "rgba(0, 167, 181, 0)" }
                    ])
                },
                z: 1,
                zlevel: 0,

            },
            {
                animation: false,
                silent: true,
                name: "Диагноз",
                id: "diagnosis",
                type: "line",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: [],
                symbol: "none",
                lineStyle: { color: "rgba(0, 120, 131, 0.5)", width: 3 },
                areaStyle: {},

                markArea: {
                    silent: false,
                    data: [],
                    itemStyle: {
                        // color: "rgba(0, 167, 181, 0.25)",
                        // borderColor: "rgba(0, 120, 131, 0.5)",
                        color: 'transparent',
                        borderColor: 'transparent',
                        borderWidth: 1
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        distance: 6,
                        formatter: (p: any) => p.name || '',
                        // backgroundColor: '#ffffff',
                        // borderRadius: 8,
                        // borderColor: '#00A7B5',
                        color: 'rgba(0, 120, 131, 1)',
                        fontFamily: 'Gilroy',
                        fontSize: 16
                    },
                    z: 999999
                },
                z: 1000,
                zlevel: 2,
                connectNulls: false
            },
            //     {
            //         id: 'dxRects',
            //         name: 'Диагноз-плашки',
            //         type: 'custom',
            //         coordinateSystem: 'cartesian2d',
            //         xAxisIndex: 0,
            //         yAxisIndex: 0,
            //         zlevel: 10,
            //         z: 10,
            //         silent: false,
            //         data: [],
            //         renderItem: dxRectsRenderItem, 
            //         tooltip: {
            //             trigger: 'item',
            //             formatter: (p: any) => {
            //                 const [start, end, , , label] = p.value as [number, number, number, number, string];
            //                 return `<div style="font-family:Gilroy">
            //     <div style="font-weight:600;margin-bottom:4px">${label}</div>
            //     <div>Интервал: ${start}–${end} с</div>
            //   </div>`;
            //             }
            //         }
            //     }
        ],
        dataZoom: [
            {
                type: "inside",
                xAxisIndex: 0,
                rangeMode: ['value', 'value'],
                filter: 'filter',
                throttle: 50
            },
            {
                type: "slider",
                xAxisIndex: 0,
                height: 70,
                backgroundColor: "rgba(245, 245, 245, 1)",
                dataBackground: { areaStyle: { color: "rgba(0, 167, 181, 0.5)" } },
                selectedDataBackground: { areaStyle: { color: "rgba(0, 167, 181, 0.94)" } },
                fillerColor: "rgba(0, 167, 181, 0.25)",
                handleStyle: { color: "rgba(0, 167, 181, 1)" },
                bottom: 0,
                left: -3,
                right: 0,
                rangeMode: ['value', 'value'],
                filter: 'filter',
                throttle: 50
            }
        ],
        grid: { left: "0", right: "0", bottom: "80px", top: "0" }
    };
}


