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
    /**
     * Updates the zoom values of the given type.
     * @param {string} zoom - The type of zoom values to update. Can be either "bpm" or "uterus".
     * @param {ZoomValues} values - The new zoom values.
     */
    setZoomValues: (zoom, values) => {
        const { bpm, uterus } = get().zoomRefs;
        console.log(zoom, values, bpm, uterus);
        if (zoom === "bpm" && bpm) bpm.current = values;
        if (zoom === "uterus" && uterus) uterus.current = values;
        set({ lastUsedZoom: zoom });
    },

    /**
     * Synchronizes the zoom values of the bpm and uterus charts.
     * If the last used zoom is uterus, it sets the bpm chart's zoom values to the uterus chart's zoom values.
     * If the last used zoom is bpm, it sets the uterus chart's zoom values to the bpm chart's zoom values.
     */
    syncZoom: () => {
        const last = get().lastUsedZoom;
        const { bpm, uterus } = get().zoomRefs;
        if (last === "uterus" && bpm && uterus) bpm.current = uterus.current;
        if (last === "bpm" && bpm && uterus) uterus.current = bpm.current;
    },
    
    /**
     * Resets the zoom values of the bpm and uterus charts to their default values.
     */
    clearZoom: () => {
        const { bpm, uterus } = get().zoomRefs;
        if (bpm) bpm.current = get().defaultZoom.bpm;
        if (uterus) uterus.current = get().defaultZoom.uterus;
    },
}))
