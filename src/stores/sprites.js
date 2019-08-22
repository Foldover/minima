import { writable } from "svelte/store";
import {RGBA} from "../services/spriteCanvas";

const _sprites = {
    count: 64,
    slots: Array.from({length: 64}, (_) => {
        return {
            spriteResolution: 16,
            pixels: Array.from({length: 16 * 16}, (_) => RGBA.black()),
        }
    }),
    selectedSlot: 0,
};

export const sprites =  writable(_sprites);
