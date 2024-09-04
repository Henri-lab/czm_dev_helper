import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties, createEntity } from "./index";
import { ModelGraphics } from "../graphics/index";
export function ModelEntity(extraOption = {}, options = {}, datasource = {}) {
    if (options && options.position) {
        let entity = {}

        entity.position = options.position
        entity.model = ModelGraphics(options)
        const finalEntity = {
            ...extraOption,
            ...entity,
        };
        return datasource.entities.add(finalEntity)
    }
}