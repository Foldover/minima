<script>
    import {onMount} from 'svelte';
    import {sprites} from "../../stores/sprites";
    import SpriteSlots from './SpriteSlots.svelte';
    import {RGBA, SpriteCanvas} from "../../services/spriteCanvas";

    let spriteEditorCanvas;
    let spriteEditorContext;
    let spriteEditorResolution = 16;
    let pixelsPerUnit;
    export let spriteStore;
    let spritesStoreUnsubscribe = sprites.subscribe((sprite) => {
        spriteStore = sprite;
    });
    let isMouseDown = false;
    const penModes = {
        draw: 0,
        erase: 1,
    };
    let activePenMode = penModes.draw;

    onMount(() => {
        spriteEditorCanvas = new SpriteCanvas(document.querySelector('#sprite-editor-canvas'));
        spriteEditorCanvas.onClick((clickEvent) => {
            handleCanvasMouseDown(clickEvent);
        });
        spriteEditorCanvas.onMouseDown((event) => {
            isMouseDown = true;
        });
        spriteEditorCanvas.onMouseMove((event) => {
            if (isMouseDown) {
                handleCanvasMouseDown(event);
            }
        });
        spriteEditorCanvas.onMouseUp((event) => {
            isMouseDown = false;
        });
        paintAll();
    });

    function handleCanvasMouseDown(event) {
        const {canvasX, canvasY} = getCanvasCoordinates(event);
        const index = canvasCoordinatesToPixelIndex(canvasX, canvasY);

        if (activePenMode === penModes.draw) {
            setPixelColor(index, RGBA.white());
            const {x, y} = pixelIndexToCanvasCoordinates(index);
            spriteEditorCanvas.drawRect(x, y, spriteStore.slots[spriteStore.selectedSlot].pixels[index]);
        } else if (activePenMode === penModes.erase) {
            setPixelColor(index, RGBA.black());
            const {x, y} = pixelIndexToCanvasCoordinates(index);
            spriteEditorCanvas.drawRect(x, y, spriteStore.slots[spriteStore.selectedSlot].pixels[index]);
        }
    }

    function paintAll() {
        spriteStore.slots[spriteStore.selectedSlot].pixels.forEach((color, index) => {
            const {x, y} = {
                x: (index % spriteEditorCanvas.resolution) * spriteEditorCanvas.pixelsPerResolutionUnit,
                y: (Math.floor(index / spriteEditorCanvas.resolution) % spriteEditorCanvas.resolution) * spriteEditorCanvas.pixelsPerResolutionUnit,
            };
            spriteEditorCanvas.drawRect(x, y, color);
        })
    }
    
    function canvasCoordinatesToPixelIndex(x, y) {
        return spriteEditorCanvas.canvasCoordinatesToPixelIndex(x, y);
    }
    
    function pixelIndexToCanvasCoordinates(index) {
        return {
            x: (index % spriteEditorCanvas.resolution) * spriteEditorCanvas.pixelsPerResolutionUnit,
            y: (Math.floor(index / spriteEditorCanvas.resolution) % spriteEditorCanvas.resolution) * spriteEditorCanvas.pixelsPerResolutionUnit,
        }
    }
    
    function setPixelColor(pixelIndex, color) {
        sprites.update(sprite => {
            sprite.slots[sprite.selectedSlot].pixels[pixelIndex] = color;
            return sprite;
        });
    }
    
    function getCanvasCoordinates(e) {
        const coords = spriteEditorCanvas.getCanvasCoordinates(e.clientX, e.clientY);
        return {
            canvasX: coords.x,
            canvasY: coords.y,
        }
    }

    function setPenMode(mode) {
        activePenMode = penModes[mode];
    }

    function onSlotClicked() {
        paintAll();
    }

</script>

<style>
    .editor-container {
        display: flex;
        flex-direction: row;
        height: 512px;
    }

    #sprite-editor-canvas {
        border: 1px solid black;
        align-self: start;
    }

    .editor-tools {
        display: flex;
        flex-direction: column;
    }
</style>

<div class="editor-container">
    <canvas width="512" height="512" id="sprite-editor-canvas"></canvas>
    <div class="editor-tools">
        <button on:click={()=>setPenMode('draw')}>Draw</button>
        <button on:click={()=>setPenMode('erase')}>Erase</button>
    </div>
    <SpriteSlots on:slotClicked={onSlotClicked}/>
</div>
