<script>
    import {onMount} from 'svelte';
    import {sprites} from "../../stores/sprites";

    let spriteEditorCanvas;
    let spriteEditorContext;
    let spriteEditorResolution = 16;
    let pixelsPerUnit;
    export let spriteStore;
    let spritesStoreUnsubscribe = sprites.subscribe((sprite) => {
        spriteStore = sprite;
    });

    onMount(() => {
        spriteEditorCanvas = document.querySelector('#sprite-editor-canvas');
        pixelsPerUnit = spriteEditorCanvas.width / spriteEditorResolution;
        spriteEditorCanvas.addEventListener('click', (clickEvent) => {
            const {canvasX, canvasY} = spriteEditor.getCanvasCoordinates(clickEvent);
            const index = spriteEditor.canvasCoordinatesToPixelIndex(canvasX, canvasY);
            spriteEditor.setPixelColor(index);
            spriteEditorContext.fillStyle = spriteStore.slots[spriteStore.selectedSlot].pixels[index];
            const {x, y} = spriteEditor.pixelIndexToCanvasCoordinates(index);
            spriteEditorContext.fillRect(x, y, pixelsPerUnit, pixelsPerUnit)
        });
        spriteEditorCanvas.addEventListener('mousedown', (event) => {
            spriteEditor.isMouseDown = true;
        });
        spriteEditorCanvas.addEventListener('mousemove', (event) => {
            if (spriteEditor.isMouseDown) {
                const {canvasX, canvasY} = spriteEditor.getCanvasCoordinates(event);
                const index = spriteEditor.canvasCoordinatesToPixelIndex(canvasX, canvasY);
                spriteEditor.setPixelColor(index);
                spriteEditorContext.fillStyle = spriteStore.slots[spriteStore.selectedSlot].pixels[index];
                const {x, y} = spriteEditor.pixelIndexToCanvasCoordinates(index);
                spriteEditorContext.fillRect(x, y, pixelsPerUnit, pixelsPerUnit)
            }
        });
        spriteEditorCanvas.addEventListener('mouseup', (event) => {
            spriteEditor.isMouseDown = false;
        });
        spriteEditorContext = spriteEditorCanvas.getContext('2d');
        spriteEditor.paintAll();
    });

    let spriteEditor = {
        clear: () => {
            spriteEditorContext.fillStyle = 'white';
            spriteEditorContext.fillRect(0, 0, spriteEditorCanvas.width, spriteEditorCanvas.height);
        },
        paintAll: () => {
            spriteStore.slots[spriteStore.selectedSlot].pixels.forEach((color, index) => {
                const {x, y} = {
                    x: (index % spriteEditorResolution) * pixelsPerUnit,
                    y: (Math.floor(index / spriteEditorResolution) % spriteEditorResolution) * pixelsPerUnit,
                };
                spriteEditorContext.fillStyle = color;
                spriteEditorContext.fillRect(x, y, pixelsPerUnit, pixelsPerUnit);
            })
        },
        canvasCoordinatesToPixelIndex: (x, y) => {
            return Math.floor(x / pixelsPerUnit) + Math.floor(y / pixelsPerUnit) * Math.floor(spriteEditorCanvas.width / pixelsPerUnit);
        },
        pixelIndexToCanvasCoordinates: (index) => {
            return {
                x: (index % spriteEditorResolution) * pixelsPerUnit,
                y: (Math.floor(index / spriteEditorResolution) % spriteEditorResolution) * pixelsPerUnit,
            }
        },
        setPixelColor: (pixelIndex) => {
            sprites.update(sprite => {
                sprite.slots[sprite.selectedSlot].pixels[pixelIndex] = 'blue';
                return sprite;
            });
        },
        getCanvasCoordinates: (e) => {
            const rect = spriteEditorCanvas.getBoundingClientRect();
            const canvasX = Math.floor(e.clientX - rect.left);
            const canvasY = Math.floor(e.clientY - rect.top);
            return {canvasX, canvasY};
        },
        isMouseDown: false
    };

    function onSlotClicked(slotN) {
        sprites.update(_sprites => {
            _sprites.selectedSlot = slotN;
            return _sprites;
        });
        spriteEditor.paintAll();
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

    .sprite-slots-list {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }
</style>

<div class="editor-container">
    <canvas width="512" height="512" id="sprite-editor-canvas"></canvas>
    <div class="sprite-slots-list">
        {#each spriteStore.slots as slot, i}
        <button on:click={()=>onSlotClicked(i)}>{i}</button>
        {/each}
    </div>
</div>
