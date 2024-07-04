import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function LabelGraphics(options = {}) {
    if (options && options.text) {
        return new Cesium.LabelGraphics({
            // 文字标签
            text: options.text,
            font: options.font || '14px sans-serif',
            fillColor: options.fillColor || Cesium.Color.GOLD,
            style: options.style || Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: options.outlineWidth || 2,
            showBackground: options.showBackground || false,
            backgroundColor:
                options.backgroundColor || new Cesium.Color(0.165, 0.165, 0.165, 0.8),
            verticalOrigin:
                options.verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: options.pixelOffset || new Cesium.Cartesian2(0, -30)
            // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        })
    }
}
