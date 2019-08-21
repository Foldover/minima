<script>
    import Tabs from './Tabs.svelte';
    import SpriteEditor from './tabs/sprite-editor/SpriteEditor.svelte';
    import CodeEditor from './tabs/code-editor/CodeEditor.svelte';

    let tabs = [
        {
            name: 'Sprite Editor',
        },
        {
            name: 'Code Editor',
        },
    ];

    let selectedTab = tabs[0];

    function handleTabClicked(tabClicked) {
        selectedTab = tabs.find(_tab => _tab.name === tabClicked.detail.tab.name);

    }
</script>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border: 1rem solid black;
    }
</style>

<Tabs tabs={tabs} on:tabClicked={handleTabClicked}/>
{#if selectedTab.name === 'Code Editor'}
    <CodeEditor/>
{:else if selectedTab.name === 'Sprite Editor'}
    <SpriteEditor/>
{/if}
