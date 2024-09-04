import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function PathGraphics(options = {}) {
    return new Cesium.PathGraphics({
        ...options,
        resolution: options.resolution || 1,
        //设置航线样式，线条颜色，内发光粗细，航线宽度等
        material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: options.glowPower || 0.1,
            color: options.color || Cesium.Color.YELLOW
        }),
        width: options.width || 10
    })
}
