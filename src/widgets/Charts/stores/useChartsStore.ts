import type { RefObject } from "react"
import { create } from "zustand"

export type ZoomValues = { start: number, end: number, startValue: number, endValue: number }
export type ZoomRef = RefObject<ZoomValues>

export type ChartsStore = {
    zoomRefs: { bpm: ZoomRef | null, uterus: ZoomRef | null }
    defaultZoom: { bpm: ZoomValues, uterus: ZoomValues }
    lastUsedZoom: "bpm" | "uterus"
    setLastUsedZoom: (zoom: "bpm" | "uterus") => void
    setZoom: (zoom: "bpm" | "uterus", zoomRef: ZoomRef) => void
    setZoomValues: (zoom: "bpm" | "uterus", values: ZoomValues) => void
    syncZoom: () => void
    clearZoom: () => void
}

export const useChartsStore = create<ChartsStore>((set, get) => ({
    zoomRefs: { bpm: null, uterus: null },
    defaultZoom: { 
        bpm: { 
            start: 0, end: 100, startValue: 0, endValue: +Infinity 
        }, 
        uterus: { 
            start: 0, end: 100, startValue: 0, endValue: +Infinity 
        } 
    },

    lastUsedZoom: "bpm",

    setLastUsedZoom: (zoom) => set({ lastUsedZoom: zoom }), 
    setZoom: (zoom, zoomRef) => set({ zoomRefs: { ...get().zoomRefs, [zoom]: zoomRef }, lastUsedZoom: zoom }),
    setZoomValues: (zoom, values) => {
        const { bpm, uterus } = get().zoomRefs;
        console.log(zoom, values, bpm, uterus);
        if (zoom === "bpm" && bpm) bpm.current = values;
        if (zoom === "uterus" && uterus) uterus.current = values;
        set({ lastUsedZoom: zoom });
    },

    syncZoom: () => {
        const last = get().lastUsedZoom;
        const { bpm, uterus } = get().zoomRefs;
        if (last === "uterus" && bpm && uterus) bpm.current = uterus.current;
        if (last === "bpm" && bpm && uterus) uterus.current = bpm.current;
    },
    clearZoom: () => {
        const { bpm, uterus } = get().zoomRefs;
        if (bpm) bpm.current = get().defaultZoom.bpm;
        if (uterus) uterus.current = get().defaultZoom.uterus;
    },
}))
