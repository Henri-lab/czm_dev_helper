import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties, createGraphics } from "./index";
import { LineGraphics } from "../graphics/index";
export function LineEntity(extraOption = {}, options = {}, datasource = {}) {
    if (options && options.positions) {
        let entity = createGraphics()
        entity.polyline = LineGraphics(options)
        console.log('entity-line',{...entity, ...extraOption})
        entity.polyline.scaleByDistance = options.scaleByDistance || new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e6, 0.5)//缩放
        entity.polyline.distanceDisplayCondition = options.distanceDisplayCondition || new Cesium.DistanceDisplayCondition(0.0, 1.5e7)//可视距离

        const finalEntity = {
            ...extraOption,
            ...entity,
        };
        console.log('lineEntity-line', finalEntity.polyline);
        console.log('datasorce', datasource)
        return datasource.entities.add(finalEntity)
    }
}
