import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties, createGraphics } from "./index";
import { CylinderGraphics } from "../graphics/index";

export function PolygonEntity(options) {
    options = options || {}
    if (options) {
        let entity = this.createGraphics()
        entity.name = options.name || ''
        entity.polygon = this.PolygonGraphics(options)
        entity.clampToS3M = this._objHasOwnProperty(options, 'clampToS3M', false)
        entity.polygon.scaleByDistance = options.scaleByDistance || new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e6, 0.5)//缩放
        entity.polygon.distanceDisplayCondition = options.distanceDisplayCondition || new Cesium.DistanceDisplayCondition(0.0, 1.5e7)//可视距离

        return this._graphicsLayer.entities.add(entity)
    }
}
