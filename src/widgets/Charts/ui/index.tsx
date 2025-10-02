import EChartsReact from "echarts-for-react"
import ContentBlock from "../../../shared/ui/blocks/ContentBlock"
import { useEffect, useMemo, useRef } from "react"
import { useDetectorStore, type DetectorStore } from "../../../entities/detector/stores/useDetectorStore"
import { getBaseOption } from "../helpers/getBaseOption"
import { markAbnormalSegments } from "../helpers/markAbnormalSegments"
import { onNewData } from "../helpers/onNewData"
import { getOnEvents } from "../helpers/getOnEvents"
import { shallow } from "zustand/shallow"
import { useChartsStore, type ChartsStore } from "../stores/useChartsStore"

const CTGChart: React.FC<{
    className?: string
    type: "bpm" | "uterus"
}> = (props) => {

    const chartRef = useRef<EChartsReact>(null)
    const zoomRef = useRef({ start: 0, end: 100, startValue: 0, endValue: +Infinity });

    const newData = useDetectorStore ((state: DetectorStore) => {
        if (props.type === "bpm") return state.lastBpmData;
        return state.lastUterusData;
    });

    const min = useDetectorStore((state: DetectorStore) => {
        if (props.type === "bpm") return state.minBpm;
        return state.minUterus;
    });

    const max = useDetectorStore((state: DetectorStore) => {
        if (props.type === "bpm") return state.maxBpm;
        return state.maxUterus;
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
        onNewData(chartRef as any, newData, zoomRef, min, max, props.type);
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
