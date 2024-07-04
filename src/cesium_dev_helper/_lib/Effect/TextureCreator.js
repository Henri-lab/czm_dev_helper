import { Cesium } from "./index.js";


class TextureCreator {
    constructor() {
        this.texture = new Cesium.Texture();
    }
    gradientTexture(options) {
        options = options || {};
        let width = options.width || 512;
        let height = options.height || 512;
        let centerX = options.centerX || width / 2;
        let centerY = options.centerY || height / 2;
        let radius = options.radius || Math.min(width, height) / 2;
        let colors = options.colors || [
            { offset: 0.1, color: "rgba(255, 255, 255, 1.0)" },
            { offset: 0.2, color: "rgba(255, 255, 255, 0.0)" },
            { offset: 0.3, color: "rgba(255, 255, 255, 0.9)" },
            { offset: 0.5, color: "rgba(255, 255, 255, 0.0)" },
            { offset: 0.9, color: "rgba(255, 255, 255, 0.2)" },
            { offset: 1.0, color: "rgba(255, 255, 255, 1.0)" }
        ];

        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        // 径向渐变
        let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        colors.forEach(color => gradient.addColorStop(color.offset, color.color));

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = gradient;
        ctx.closePath();
        ctx.fill();
        return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    }
}

export default TextureCreator;