import {SpriteCanvas} from "../src/services/spriteCanvas";

export const FLIP = {
    NONE: 0,
    HORIZONTAL: 1,
    VERTICAL: 2
};

export class Renderer2D {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
    }

    drawImage(image, x, y, flip) {
        if (flip === FLIP.HORIZONTAL) {
            this.ctx.scale(-1, 1);
            this.resetTransform();
        } else if (flip === FLIP.VERTICAL) {
            this.ctx.scale(1, -1);
            this.resetTransform();
        }
        this.ctx.drawImage(image, x, y);
    }

    resetTransform() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

export function GameTemplate() {
    this.body = document.body;
    this.canvasElement = document.createElement('canvas');
    this.canvasElement.width = 640;
    this.canvasElement.height = 480;
    this.body.appendChild(this.canvasElement);
    this.renderer = new Renderer2D(this.canvasElement);
    this.sprites = [];
    this.secondsPerFrame = 1 / 30;
    // @SPRITES_DATA

    this.createSpritesFromSpriteData();

    const sprite = (n, x, y, flip = FLIP.NONE) => {
        this.renderer.drawImage(this.sprites[n], x, y, flip);
    };

    // @GAME_CODE

    const updateInterval = () => {
        setTimeout(() => {
            setTimeout(updateInterval, this.secondsPerFrame);
            requestAnimationFrame(() => update());
        }, this.secondsPerFrame)
    };

    updateInterval();
}

GameTemplate.prototype.createSpritesFromSpriteData = function() {
    this.sprites = this.spritesData.
        map((spriteData) => {
            const tempCanvas = SpriteCanvas.CanvasFromData(spriteData);
            return tempCanvas.toImage();
    });
};
