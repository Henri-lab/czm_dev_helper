import * as Cesium from "cesium";
import { objHasOwnProperty, setProperties, createGraphics } from "./index";
import { CylinderGraphics } from "../graphics/index";


export function CylinderEntity(extraOption = {}, options = {}, datasource = {}) {

    let entity = createGraphics();

    // 设置属性的默认值和传入的值
    const properties = [
        { key: 'length', defaultValue: 10 },
        { key: 'topRadius', defaultValue: 5 },
        { key: 'bottomRadius', defaultValue: 5 },
        { key: 'material', defaultValue: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW) }
    ];

    // 设置属性
    setProperties(options, properties);

    // 创建圆柱几何体
    entity.cylinder = CylinderGraphics(options.cylinder)

    // 将实体添加到图层
    return datasource.entities.add({
        ...extraOption,
        cylinder: entity.cylinder,
    });

}