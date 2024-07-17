import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function RectangleGraphics(options = {}) {
        if (!Array.isArray(options.positions)) throw new TypeError("arg.positions must be an array")
        const w_s_e_n = new Cesium.Rectangle.fromCartesianArray(options.positions)
        return new Cesium.RectangleGraphics({
            // 后面的属性会覆盖前面的属性值
            ...options,
            coordinates: w_s_e_n,
            color: options.color || Cesium.Color.GREEN,
            pixelSize: options.pixelSize || 5,
            outlineColor: options.outlineColor || Cesium.Color.WHITE,
            outlineWidth: options.outlineWidth || 1
        })
}