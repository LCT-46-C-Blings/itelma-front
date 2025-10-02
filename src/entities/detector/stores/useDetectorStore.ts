import { create } from "zustand";
import type { BpmData } from "../types/BpmData";
import type { CtgLiveDetector, FhrSegment, UterusSegment } from "ctg-live-detector-ts";
import type { UterusData } from "../types/UterusData";

export type DetectorStore = {
    detector: CtgLiveDetector | undefined;
    setDetector: (detector: CtgLiveDetector) => void;

    bpmData: BpmData[];
    lastBpmData: BpmData | undefined;
    maxBpm: number;
    minBpm: number;
    pushBpmData: (data: BpmData) => void;
    getBpmDataSlice: (startTime: number, endTime: number) => BpmData[];

    uterusData: UterusData[];
    lastUterusData: UterusData | undefined;
    maxUterus: number;
    minUterus: number;
    pushUterusData: (data: UterusData) => void;
    getUterusDataSlice: (startTime: number, endTime: number) => UterusData[];

    fhrSegments: FhrSegment[];
    fhrSegmentsQueue: FhrSegment[];
    pushFhrSegment: (segment: FhrSegment) => void;
    fhrSegmentsQueuePop: () => FhrSegment | undefined;

    uterusSegments: UterusSegment[];
    uterusSegmentsQueue: UterusSegment[];
    pushUterusSegment: (segment: UterusSegment) => void;
    uterusSegmentsQueuePop: () => UterusSegment | undefined;

    allSegments: (FhrSegment | UterusSegment)[];
    getSegmentChartType: (segment: FhrSegment | UterusSegment) => "bpm" | "uterus";
}

export const useDetectorStore = create<DetectorStore>((set, get) => ({

    detector: undefined,
    setDetector: (detector: CtgLiveDetector) => set(() => ({ detector })),

    bpmData: [],
    lastBpmData: undefined,
    maxBpm: 0,
    minBpm: 300,
    pushBpmData: (data: BpmData) => {
        set((state: DetectorStore) => {
            if (state.detector) {
                const seg = state.detector.pushFhr(data);
                if (seg.fhrSegments.length) {
                    seg.fhrSegments.map(state.pushFhrSegment)
                }
            }

            return {
                bpmData: [...state.bpmData, data],
                maxBpm: Math.max(data.bpm, state.maxBpm),
                minBpm: Math.min(data.bpm, state.minBpm),
                lastBpmData: data
            }
        })

    },
    getBpmDataSlice: (startTime: number, endTime: number) => get().bpmData.filter(data => data.time >= startTime && data.time <= endTime),

    uterusData: [],
    lastUterusData: undefined,
    maxUterus: 0,
    minUterus: 300,
    pushUterusData: (data: UterusData) => {
        set((state: DetectorStore) => {
            if (state.detector) {
                const seg = state.detector.pushUterus(data);
                if (seg.uterusSegments.length) {
                    seg.uterusSegments.map(state.pushUterusSegment)
                }
            }

            return {
                uterusData: [...state.uterusData, data],
                maxUterus: Math.max(data.uterus, state.maxUterus),
                minUterus: Math.min(data.uterus, state.minUterus),
                lastUterusData: data
            }
        })
    },
    getUterusDataSlice: (startTime: number, endTime: number) => get().uterusData.filter(data => data.time >= startTime && data.time <= endTime),


    fhrSegments: [],
    fhrSegmentsQueue: [],
    pushFhrSegment: (segment: FhrSegment) => set(
        (state: DetectorStore) => {
            return {
                fhrSegments: [...state.fhrSegments, segment],
                fhrSegmentsQueue: [...state.fhrSegmentsQueue, segment],
                allSegments: [...state.allSegments, segment]
            }
        }
    ),
    fhrSegmentsQueuePop: () => {
        const queue = get().fhrSegmentsQueue;
        if (queue.length === 0) return undefined;

        const [first, ...rest] = queue;
        set({ fhrSegmentsQueue: rest });
        return first;
    },

    uterusSegments: [],
    uterusSegmentsQueue: [],
    pushUterusSegment: (segment: UterusSegment) => set(
        (state: DetectorStore) => {
            return {
                uterusSegments: [...state.uterusSegments, segment],
                uterusSegmentsQueue: [...state.uterusSegmentsQueue, segment],
                allSegments: [...state.allSegments, segment]
            }
        }
    ),
    uterusSegmentsQueuePop: () => {
        const queue = get().uterusSegmentsQueue;
        if (queue.length === 0) return undefined;

        const [first, ...rest] = queue;
        set({ uterusSegmentsQueue: rest });
        return first;
    },

    allSegments: [],
    getSegmentChartType: (segment: FhrSegment | UterusSegment) => "minBpm" in segment ? "bpm" : "uterus"
}));