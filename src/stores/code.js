import { writable } from "svelte/store";

const _code = {
    count: 16,
    slots: Array.from({length: 64}, (_) => ''),
    selectedSlot: 0,
};

export const code =  writable(_code);
