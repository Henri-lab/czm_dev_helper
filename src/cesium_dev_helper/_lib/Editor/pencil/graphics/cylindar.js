import * as Cesium from "cesium";
export function CylinderGraphics(options={}) {
        return new Cesium.CylinderGraphics({
            ...options,
            HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            length: options.length || 500 / 2,
            topRadius: options.topRadius || 0,
            bottomRadius: options.bottomRadius || 0,
            material: options.material || new Cesium.Color(0, 1, 1, 0.4),
            slices: options.slices || 128
        })
}