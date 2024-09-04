import * as Cesium from "cesium";
import { createEntity } from "./index";
import { PointGraphics, BillboardGraphics, LabelGraphics } from "../graphics/index";


export function PointEntities(extraOption = {}, options = {}, datasource = {}) {
    if (options && options.positions) {
        let points = []
        for (let i in options.positions) {
            let posItem = options.positions[i]
            let entity = {}
            if (options.point) entity.point = PointGraphics(options)
            if (options.billboard)
                entity.billboard = BillboardGraphics(options.billboard)
            if (options.label) entity.label = LabelGraphics(options.label)
            const finalEntity = {
                ...extraOption,
                ...entity,
                position: posItem,
            }
            const point = datasource.entities.add(finalEntity)
            points.push(point)
        }
        return points
    }
}