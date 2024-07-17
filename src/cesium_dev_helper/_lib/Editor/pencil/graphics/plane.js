import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties } from "./index";
export function PlaneGraphics(options = {}) {
        return new Cesium.PlaneGraphics({
            ...options,
            plane: options.plane || new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0), // PlaneGraphics 的一个属性是 Plane 
            dimensions: options.dimensions || new Cesium.Cartesian2(100.0, 100.0),
            material: options.material || Cesium.Color.RED.withAlpha(0.5), // 走廊的颜色和透明度
            outline: options.outline || true, // 是否显示轮廓线
            outlineColor: options.outline || Cesium.Color.BLACK, // 轮廓线颜色
            distanceDisplayCondition: options.distanceDisplayCondition || undefined,
            shadows: options.shadows || Cesium.ShadowMode.DISABLED // 投影模式
        })
}