function toHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

export class RGBA {
    constructor(r = 255, g = 255, b = 255, a = 255) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }

    static white() {
        return new RGBA();
    }

    static black() {
        return new RGBA(0, 0, 0, 255);
    }

    toCSSValue() {
        return `#${toHex(this.red, 2)}${toHex(this.green, 2)}${toHex(this.blue, 2)}${toHex(this.alpha, 2)}`;
    }
}

export class SpriteCanvas {
    constructor(canvasElement, resolution = 16, clearColor = RGBA.black(), width = undefined, height = undefined) {
        this.element = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.resolution = resolution;
        this.width = width || canvasElement.width;
        this.height = height || canvasElement.height;
        this.clearColor = clearColor;
        this.clickCallbacks = [];
        this.mouseDownCallbacks = [];
        this.mouseMoveCallbacks = [];
        this.mouseUpCallbacks = [];

        this.element.addEventListener('click', (clickEvent) => {
            this.clickCallbacks.forEach(cb => cb(clickEvent));
        });

        this.element.addEventListener('mousedown', (event) => {
            this.mouseDownCallbacks.forEach(cb => cb(event));
        });

        this.element.addEventListener('mousemove', (event) => {
            this.mouseMoveCallbacks.forEach(cb => cb(event));
        });

        this.element.addEventListener('mouseup', (event) => {
            this.mouseUpCallbacks.forEach(cb => cb(event));
        });

        this.calculatePixelsPerResolutionUnit();
        this.clear();
    }

    onClick(cb) {
        this.clickCallbacks.push(cb);
    }

    onMouseDown(cb) {
        this.mouseDownCallbacks.push(cb);
    }

    onMouseMove(cb) {
        this.mouseMoveCallbacks.push(cb);
    }

    onMouseUp(cb) {
        this.mouseUpCallbacks.push(cb);
    }

    getCanvasCoordinates(_x, _y) {
        const rect = this.element.getBoundingClientRect();
        const x = Math.floor(_x - rect.left);
        const y = Math.floor(_y - rect.top);
        return {x, y};
    }

    canvasCoordinatesToPixelIndex(x, y) {
        return Math.floor(x / this.pixelsPerResolutionUnit) + Math.floor(y / this.pixelsPerResolutionUnit) *
            Math.floor(this.width / this.pixelsPerResolutionUnit);
    }

    calculatePixelsPerResolutionUnit() {
        this.pixelsPerResolutionUnit = this.width / this.resolution;
    }

    clear() {
        this.ctx.fillStyle = this.clearColor.toCSSValue();
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawRect(x, y, color) {
        console.log(x, y);
        this.ctx.fillStyle = color.toCSSValue();
        this.ctx.fillRect(x, y, this.pixelsPerResolutionUnit, this.pixelsPerResolutionUnit);
    }
}
