import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function ModelGraphics(options) {
    options = options || {}
    if (options) {
        return new Cesium.ModelGraphics({
            uri: options.m_url || options.url,
            scale: options.m_scale || options.scale || 10,
            clampAnimations: true
        })
    }
}
