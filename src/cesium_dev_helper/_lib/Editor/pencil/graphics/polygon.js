import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function PolygonGraphics(options = {}) {

    if (options && options.positions) {
        return new Cesium.PolygonGraphics({
            ...options,
            hierarchy: {
                // cartesian3
                positions: options.positions
            },
            material: options.material || Cesium.Color.RED.withAlpha(0.2),
            clampToGround: options.clampToGround || false
        })
    }
}