<script xmlns:on="http://www.w3.org/1999/xhtml">
    import { sprites } from "../../stores/sprites";
    import {createEventDispatcher} from 'svelte';

    let spriteStore;
    const dispatch = createEventDispatcher();
    const unsubscribeSpritesStore = sprites.subscribe((sprite) => {
        spriteStore = sprite;
    });

    function onSlotClicked(slotN) {
        sprites.update(_sprites => {
            _sprites.selectedSlot = slotN;
            return _sprites;
        });
        dispatch('slotClicked', {});
    }
</script>

<style>
    .sprite-slots-list {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }
</style>

<div class="sprite-slots-list">
    {#each spriteStore.slots as slot, i}
    <button on:click={()=>onSlotClicked(i)}>{i}</button>
    {/each}
</div>
