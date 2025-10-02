import { create } from "zustand";
import type { BpmData } from "../types/BpmData";
import type { CtgLiveDetector, FhrSegment, UterusSegment } from "ctg-live-detector-ts";
import type { UterusData } from "../types/UterusData";

/**
 * Store for managing detector data.
 *
 * @module detector/stores/useDetectorStore
 */
export type DetectorStore = {
    detector: CtgLiveDetector | undefined;
    setDetector: (detector: CtgLiveDetector) => void;

    bpmData: BpmData[];
    lastBpmData: BpmData | undefined;
    loadedBpmSnapshot: BpmData[];
    maxBpm: number;
    minBpm: number;
    pushBpmData: (data: BpmData) => void;
    getBpmDataSlice: (startTime: number, endTime: number) => BpmData[];

    uterusData: UterusData[];
    lastUterusData: UterusData | undefined;
    loadedUterusSnapshot: UterusData[];
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
    clear: () => void

    loadBpmSnapshot: (snapshot: BpmData[]) => void
    loadUterusSnapshot: (snapshot: UterusData[]) => void
}

export const useDetectorStore = create<DetectorStore>((set, get) => ({

    detector: undefined,
    setDetector: (detector: CtgLiveDetector) => set(() => ({ detector })),

    bpmData: [],
    lastBpmData: undefined,
    loadedBpmSnapshot: [],
    maxBpm: 0,
    minBpm: 300,
    /**
     * Pushes a new BpmData to the store.
     * If the detector is set, it will also push the new segment to the fhrSegments.
     * @param {BpmData} data - The new BpmData to push.
     */
    pushBpmData: (data: BpmData) => {
        // console.log(data)
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
    loadedUterusSnapshot: [],
    maxUterus: 0,
    minUterus: 300,
    /**
     * Pushes a new UterusData to the store.
     * If the detector is set, it will also push the new segment to the uterusSegments.
     * @param {UterusData} data - The new UterusData to push.
     */
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
    /**
     * Pushes a new FhrSegment to the store.
     * If the detector is set, it will also push the new segment to the fhrSegments.
     * @param {FhrSegment} segment - The new FhrSegment to push.
     */
    pushFhrSegment: (segment: FhrSegment) => set(
        (state: DetectorStore) => {
            return {
                fhrSegments: [...state.fhrSegments, segment],
                fhrSegmentsQueue: [...state.fhrSegmentsQueue, segment],
                allSegments: [...state.allSegments, segment]
            }
        }
    ),
    /**
     * Pops the first segment from the fhrSegmentsQueue.
     * If the queue is empty, returns undefined.
     * @returns {FhrSegment | undefined} - The first segment in the queue, or undefined if the queue is empty.
     */
    fhrSegmentsQueuePop: () => {
        const queue = get().fhrSegmentsQueue;
        if (queue.length === 0) return undefined;

        const [first, ...rest] = queue;
        set({ fhrSegmentsQueue: rest });
        return first;
    },

    uterusSegments: [],
    uterusSegmentsQueue: [],
    /**
     * Pushes a new UterusSegment to the store.
     * If the detector is set, it will also push the new segment to the uterusSegments.
     * @param {UterusSegment} segment - The new UterusSegment to push.
     */
    pushUterusSegment: (segment: UterusSegment) => set(
        (state: DetectorStore) => {
            return {
                uterusSegments: [...state.uterusSegments, segment],
                uterusSegmentsQueue: [...state.uterusSegmentsQueue, segment],
                allSegments: [...state.allSegments, segment]
            }
        }
    ),
    /**
     * Pops the first segment from the uterusSegmentsQueue.
     * If the queue is empty, returns undefined.
     * @returns {UterusSegment | undefined} - The first segment in the queue, or undefined if the queue is empty.
     */
    uterusSegmentsQueuePop: () => {
        const queue = get().uterusSegmentsQueue;
        if (queue.length === 0) return undefined;

        const [first, ...rest] = queue;
        set({ uterusSegmentsQueue: rest });
        return first;
    },

    allSegments: [],
    getSegmentChartType: (segment: FhrSegment | UterusSegment) => "minBpm" in segment ? "bpm" : "uterus",

    /**
     * Resets the store to its initial state.
     * This function clears all the data in the store, including the detector, BpmData, UterusData, FhrSegments, UterusSegments, and their respective queues.
     */
    clear: () => set({
        detector: undefined,
        bpmData: [],
        lastBpmData: undefined,
        maxBpm: 0,
        minBpm: 300,
        uterusData: [],
        lastUterusData: undefined,
        maxUterus: 0,
        minUterus: 300,
        fhrSegments: [],
        fhrSegmentsQueue: [],
        uterusSegments: [],
        uterusSegmentsQueue: [],
        allSegments: [],
        loadedBpmSnapshot: [],
        loadedUterusSnapshot: []
    }),

    loadBpmSnapshot: (snapshot: BpmData[]) => set({ bpmData: snapshot, loadedBpmSnapshot: snapshot }),
    loadUterusSnapshot: (snapshot: UterusData[]) => set({ uterusData: snapshot, loadedUterusSnapshot: snapshot }),
}));