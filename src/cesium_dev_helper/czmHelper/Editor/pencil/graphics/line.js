import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function LineGraphics(options = {}) {
    if (options && options.positions) {
        return new Cesium.PolylineGraphics({
            show: true,
            positions: options.positions,
            material: options.material || Cesium.Color.YELLOW,
            width: options.width || 1,
            clampToGround: objHasOwnProperty(options, 'clampToGround', false)
        })
    }
}