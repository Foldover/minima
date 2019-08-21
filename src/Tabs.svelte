<script>
    import { onMount } from 'svelte';
    import {createEventDispatcher} from 'svelte';

    export let tabs;
    export let selected;

    const dispatch = createEventDispatcher();

    onMount(() => {
        selected = tabs[0];
    });

    function onTabClick(tab) {
        selected = tabs.find(_tab => _tab.name === tab.name);
        dispatch('tabClicked', {
            tab
        })
    }
</script>

<style>
    .tabs-container {
        display: flex;
        flex-direction: row;
    }

    .tab {
        padding: 0.5rem;
        border: 1px solid black;
    }

    .tab:hover {
        cursor: pointer;
    }

    .tab-selected {
        background-color: #cccccc;
    }
</style>

<div class="tabs-container">
    {#each tabs as tab}
    <div class="tab" class:tab-selected={selected && tab.name === selected.name} on:click={()=> onTabClick(tab)}>{tab.name}</div>
    {/each}
</div>

