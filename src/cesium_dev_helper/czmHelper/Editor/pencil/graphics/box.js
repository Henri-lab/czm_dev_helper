import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function BoxGraphics(options={}) {
    if (options) {
        return new Cesium.BoxGraphics({
            ...options,
            show: objHasOwnProperty(options, 'show', true),
            fill: objHasOwnProperty(options, 'fill', true),
            dimensions: options.dimensions || new Cesium.Cartesian3(0, 0, 0),
            material: options.material,
            outline: objHasOwnProperty(options, 'outline', true),
            outlineColor: options.outlineColor || Cesium.Color.BLACK,
            distanceDisplayCondition: options.distanceDisplayCondition || undefined
        })
    }
}