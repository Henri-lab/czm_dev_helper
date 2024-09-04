import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties, createEntity } from "./index";
import { PolygonGraphics } from "../graphics/index";

export function PolygonEntity(extraOption = {}, options = {}, datasource = {}) {
    if (options) {
        let entity = {}
        entity.polygon = PolygonGraphics(options)
        entity.polygon.scaleByDistance = options.scaleByDistance || new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e6, 0.5)//缩放
        entity.polygon.distanceDisplayCondition = options.distanceDisplayCondition || new Cesium.DistanceDisplayCondition(0.0, 1.5e7)//可视距离
        const finalEntity = {
            ...extraOption,
            ...entity,
        };
        return datasource.entities.add(finalEntity)
    }
}
