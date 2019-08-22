<script>
    import {onMount} from 'svelte';
    import {sprites} from "../../stores/sprites";
    import SpriteSlots from './SpriteSlots.svelte';

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
        spriteEditorCanvas = document.querySelector('#sprite-editor-canvas');
        pixelsPerUnit = spriteEditorCanvas.width / spriteEditorResolution;
        spriteEditorCanvas.addEventListener('click', (clickEvent) => {
            handleCanvasMouseDown(clickEvent);
        });
        spriteEditorCanvas.addEventListener('mousedown', (event) => {
            isMouseDown = true;
        });
        spriteEditorCanvas.addEventListener('mousemove', (event) => {
            if (isMouseDown) {
                handleCanvasMouseDown(event);
            }
        });
        spriteEditorCanvas.addEventListener('mouseup', (event) => {
            isMouseDown = false;
        });
        spriteEditorContext = spriteEditorCanvas.getContext('2d');
        paintAll();
    });

    function handleCanvasMouseDown(event) {
        const {canvasX, canvasY} = getCanvasCoordinates(event);
        const index = canvasCoordinatesToPixelIndex(canvasX, canvasY);

        if (activePenMode === penModes.draw) {
            setPixelColor(index, 'blue');
            spriteEditorContext.fillStyle = spriteStore.slots[spriteStore.selectedSlot].pixels[index];
            const {x, y} = pixelIndexToCanvasCoordinates(index);
            spriteEditorContext.fillRect(x, y, pixelsPerUnit, pixelsPerUnit)
        } else if (activePenMode === penModes.erase) {
            setPixelColor(index, 'white');
            spriteEditorContext.fillStyle = spriteStore.slots[spriteStore.selectedSlot].pixels[index];
            const {x, y} = pixelIndexToCanvasCoordinates(index);
            spriteEditorContext.fillRect(x, y, pixelsPerUnit, pixelsPerUnit)
        }
    }
    
    function clear() {
        spriteEditorContext.fillStyle = 'white';
        spriteEditorContext.fillRect(0, 0, spriteEditorCanvas.width, spriteEditorCanvas.height);
    }

    function drawRect(x, y, color) {
        spriteEditorContext.fillStyle = color;
        spriteEditorContext.fillRect(x, y, pixelsPerUnit, pixelsPerUnit);
    }

    function paintAll() {
        spriteStore.slots[spriteStore.selectedSlot].pixels.forEach((color, index) => {
            const {x, y} = {
                x: (index % spriteEditorResolution) * pixelsPerUnit,
                y: (Math.floor(index / spriteEditorResolution) % spriteEditorResolution) * pixelsPerUnit,
            };
            drawRect(x, y, color);
        })
    }
    
    function canvasCoordinatesToPixelIndex(x, y) {
        return Math.floor(x / pixelsPerUnit) + Math.floor(y / pixelsPerUnit) * Math.floor(spriteEditorCanvas.width / pixelsPerUnit);
    }
    
    function pixelIndexToCanvasCoordinates(index) {
        return {
            x: (index % spriteEditorResolution) * pixelsPerUnit,
            y: (Math.floor(index / spriteEditorResolution) % spriteEditorResolution) * pixelsPerUnit,
        }
    }
    
    function setPixelColor(pixelIndex, color) {
        sprites.update(sprite => {
            sprite.slots[sprite.selectedSlot].pixels[pixelIndex] = color;
            return sprite;
        });
    }
    
    function getCanvasCoordinates(e) {
        const rect = spriteEditorCanvas.getBoundingClientRect();
        const canvasX = Math.floor(e.clientX - rect.left);
        const canvasY = Math.floor(e.clientY - rect.top);
        return {canvasX, canvasY};
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
