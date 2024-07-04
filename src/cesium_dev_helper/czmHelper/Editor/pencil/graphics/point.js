import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function PointGraphics(options = {}) {
    if (options) {
        return new Cesium.PointGraphics({
            color: options.color || Cesium.Color.GREEN,
            pixelSize: options.pixelSize || 5,
            outlineColor: options.outlineColor || Cesium.Color.WHITE,
            outlineWidth: options.outlineWidth || 1
        })
    }
}