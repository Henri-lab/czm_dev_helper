import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties, createGraphics } from "./index";
import { BoxGraphics } from "../graphics/index";
export function BoxEntity(extraOption = {}, options = {}, datasource = {}) {
    if (options) {
        let entity = {}
        entity.box = BoxGraphics(options)

        const finalEntity = {
            ...extraOption,
            ...entity,
        };
        return datasource.entities.add(finalEntity)
    }
}