<script>
    import Tabs from './Tabs.svelte';
    import SpriteEditor from './tabs/sprite-editor/SpriteEditor.svelte';
    import CodeEditor from './tabs/code-editor/CodeEditor.svelte';
    import {GameBuilder} from "./build/gameBuilder";

    import { sprites } from "./stores/sprites";
    import { code} from "./stores/code";

    let tabs = [
        {
            name: 'Sprite Editor',
        },
        {
            name: 'Code Editor',
        },
    ];

    let selectedTab = tabs[0];
    let spriteData;
    let codeData;
    const unsubscribeSpriteStore = sprites.subscribe((_sprites) => {
        spriteData = _sprites;
    });
    const unsubscribeCodeStore = code.subscribe((_code) => {
        codeData = _code;
    });

    function handleTabClicked(tabClicked) {
        selectedTab = tabs.find(_tab => _tab.name === tabClicked.detail.tab.name);

    }

    function buildGame() {
        const gameBuilder = new GameBuilder();
        spriteData.slots.forEach(sd => {
            gameBuilder.addSpriteData(sd);
        });
        codeData.slots.forEach(cd => {
            gameBuilder.addCode(cd);
        });

        gameBuilder.build();
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
<button on:click={buildGame}>Build</button>
