import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties, createGraphics } from "./index";
import { CorridorGraphics } from "../graphics/index";
export function CorridorEntity(extraOption = {}, options = {}, datasource = {}) {
  if (options && options.positions) {
    let entity = {}

    const properties = [
      { key: 'height', defaultValue: 10 },
      { key: 'width', defaultValue: 10 },
      { key: 'extrudedHeight', defaultValue: 10 },
      { key: 'cornerType', defaultValue: 'round' },
      {
        key: 'material', defaultValue: new Cesium.Scene.WarnLinkMaterialProperty({
          freely: 'cross',
          color: Cesium.Color.YELLOW,
          duration: 1000,
          count: 1.0,
          direction: '+'
        })
      }
    ];
    setProperties(options, properties);
    entity.corridor = CorridorGraphics(options);

    const finalEntity = {
      ...extraOption,
      ...entity,
    }
    return datasource.entities.add(finalEntity)
  }
}
