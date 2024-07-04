import { BoxEntity } from "./box";
import { CorridorEntity } from "./corridor";
import { EllipseEntity } from "./ellipse";
import { LineEntity } from "./line";
import { ModelEntity } from "./model";
import { PointEntities } from "./point";
import { PolygonEntity } from "./polygon";
import { objHasOwnProperty, setProperties } from "../../../util/properties";

import Graphics from "../Graphics";
import { DrawingManager } from "../../../Manager";


const createGraphics = DrawingManager.createGraphics();

// 生成实体的坐标要采用Cartesian3
export {
    BoxEntity,
    CorridorEntity,
    EllipseEntity,
    LineEntity,
    ModelEntity,
    PointEntities,
    PolygonEntity,
    objHasOwnProperty,
    setProperties,
    createGraphics,//method in drawing manager
}