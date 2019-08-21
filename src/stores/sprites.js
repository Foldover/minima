import { writable } from "svelte/store";

const _sprites = {
    count: 64,
    slots: Array.from({length: 64}, (_) => {
        return {
            spriteResolution: 16,
            pixels: Array.from({length: 16 * 16}, (_) => 'white'),
        }
    }),
    selectedSlot: 0,
};

export const sprites =  writable(_sprites);
