import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties, createGraphics } from "./index";
import { EllipseGraphics } from "../graphics/index";
export function EllipseEntity(extraOption = {}, options = {}, datasource = {}) {
    // 创建实体
    let entity = {}
    entity.ellipse = EllipseGraphics(options)
    const finalEntity = {
        ...extraOption,
        ...entity,
    };
    return datasource.entities.add(finalEntity)
}