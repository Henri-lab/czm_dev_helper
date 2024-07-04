import * as Cesium from "cesium";
import { createGraphics } from "./index";
import { PointGraphics, BillboardGraphics, LabelGraphics } from "../graphics/index";


export function PointEntities(extraOption = {}, options = {}, datasource = {}) {
    if (options && options.positions) {
        let points = []
        for (let i in options.positions) {
            let posItem = options.positions[i]
            let entity = createGraphics()
            if (options.point) entity.point = PointGraphics(options.point)
            if (options.billboard)
                entity.billboard = BillboardGraphics(options.billboard)
            if (options.label) entity.label = LabelGraphics(options.label)

            const point = datasource.entities.add({
                ...extraOption,
                point: entity.point,
                billboard: entity.billboard,
                label: entity.label,
                position: Cesium.Cartesian3.fromDegrees(posItem)
            })
            points.push(point)
        }
        return points
    }
}