// 在 Cesium 中实体的位置属性（position）通常在 graphics 属性外部设置，而不是嵌套在具体的 Graphics 属性中
// 位置数据都是通过顶层实体的 position 属性或特定的图形属性（如 positions 或 hierarchy）来设置的。这样设计的目的是为了统一管理实体的位置，使得图形属性可以专注于具体的图形绘制和外观控制。
// 特殊:polyline-positions ,corridor-positions,wall-positions, polygon-hierarchy,rectangle-coordinates等等:

import { BillboardGraphics } from "./billboard";
import { BoxGraphics } from "./box";
import { CorridorGraphics } from './corridor';
import { CylinderGraphics } from './cylindar';
import { EllipseGraphics } from './ellipse';
import { EllipsoidGraphics } from './ellipsoid';
import { LabelGraphics } from './label';
import { LineGraphics } from './line';
import { ModelGraphics } from './model';
import { PathGraphics } from './path';
import { PlaneGraphics } from './plane';
import { PointGraphics } from './point';
import { PolygonGraphics } from "./polygon";
import { objHasOwnProperty, setProperties } from "../../../util/properties";
import { createEntity } from "../entities";


//根据类型type获得Graphics的方法名
function getMethodNameByType(type) {
    const _type = type.toLowerCase();
    switch (_type) {
        case 'point':
            return 'PointEntities';
        case 'polyline':
            return 'LineEntity';
        case 'polygon':
            return ' PolygonEntity';
        case 'circle':
            return 'EllipseGraphics';
        default:
            throw new TypeError(`Unsupported type: ${type}`);
    }
}
export {
    createEntity,
    BillboardGraphics,
    BoxGraphics,
    CorridorGraphics,
    CylinderGraphics,
    EllipseGraphics,
    EllipsoidGraphics,
    LabelGraphics,
    LineGraphics,
    ModelGraphics,
    PathGraphics,
    PlaneGraphics,
    PointGraphics,
    PolygonGraphics,
    objHasOwnProperty,
    setProperties,
    
    getMethodNameByType,
};


