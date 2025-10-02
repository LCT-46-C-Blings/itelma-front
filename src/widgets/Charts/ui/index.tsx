import EChartsReact from "echarts-for-react"
import ContentBlock from "../../../shared/ui/blocks/ContentBlock"
import { useEffect, useMemo, useRef } from "react"
import { useDetectorStore, type DetectorStore } from "../../../entities/detector/stores/useDetectorStore"
import { getBaseOption } from "../helpers/getBaseOption"
import { markAbnormalSegments } from "../helpers/markAbnormalSegments"
import { onNewData } from "../helpers/onNewData"
import { getOnEvents } from "../helpers/getOnEvents"
import { useChartsStore, type ChartsStore } from "../stores/useChartsStore"
import { onSnapshot } from "../helpers/onSnapshot"


/**
 * A React component that renders a CTGChart with a type of either "bpm" or "uterus".
 * It accepts an optional className prop to allow for custom styling.
 * 
 * @param {string} [className] Optional CSS class name for the component.
 * @param {"bpm" | "uterus"} type The type of the chart. Either "bpm" or "uterus".
 * 
 * @returns {React.ReactElement} A React element representing the component.
 */
const CTGChart: React.FC<{
    className?: string
    type: "bpm" | "uterus"
}> = (props) => {

    const chartRef = useRef<EChartsReact>(null)
    const zoomRef = useRef({ start: 0, end: 100, startValue: 0, endValue: +Infinity });

    const data = useDetectorStore((state: DetectorStore) => {
        if (props.type === "bpm") return state.bpmData;
        return state.uterusData;
    });

    const snapshot = useDetectorStore((state: DetectorStore) => {
        if (props.type === "bpm") return state.loadedBpmSnapshot;
        return state.loadedUterusSnapshot;
    });

    const newData = useDetectorStore ((state: DetectorStore) => {
        if (props.type === "bpm") return state.lastBpmData;
        return state.lastUterusData;
    });

    const segmentsQueue = useDetectorStore((state: DetectorStore) => {
        if (props.type === "bpm") return state.fhrSegmentsQueue;
        return state.uterusSegmentsQueue;
    });

    const segmentsQueuePop = useDetectorStore((state: DetectorStore) => {
        if (props.type === "bpm") return state.fhrSegmentsQueuePop;
        return state.uterusSegmentsQueuePop;
    });

    const dataSlice = useDetectorStore((state: DetectorStore) => {
        if (props.type === "bpm") return state.getBpmDataSlice;
        return state.getUterusDataSlice;
    });

    const setZoom = useChartsStore((state: ChartsStore) => state.setZoom);

    useEffect(() => {
        setZoom(props.type, zoomRef);
    }, [zoomRef.current])

    useEffect(() => {
        onNewData(chartRef as any, newData, zoomRef, props.type);
    }, [newData])

    useEffect(() => {
        if (segmentsQueue.length) {
            const segment = segmentsQueuePop();
            if (!segment) return
            markAbnormalSegments(
                chartRef as any,
                segment,
                dataSlice(segment?.startTime!, segment?.endTime!),
                props.type
            );
        }
    }, [segmentsQueue.length])

    useEffect(() => {
        if (data.length == 0) {
            // console.log('chart cleared')
            chartRef.current?.getEchartsInstance().setOption({
                series: {
                    data: []
                }
            })
        }
    }, [data.length])

    useEffect(() => {
        onSnapshot(chartRef as any, snapshot, props.type);
    }, [snapshot.length])

    const option = useMemo(() => { return getBaseOption(props.type) }, []);

    const onEvents = useMemo(() => {
        return getOnEvents(chartRef as any, zoomRef);
    }, [])

    return (
        <ContentBlock className={"p-0! overflow-hidden " + props.className} >
            <EChartsReact ref={chartRef} onEvents={onEvents} style={{ height: "100%" }
            } option={option} />
        </ContentBlock>
    )
}

export default CTGChart
