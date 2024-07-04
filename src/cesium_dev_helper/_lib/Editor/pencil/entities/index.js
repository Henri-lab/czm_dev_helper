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


// 基本实体速览
// const viewer = new Cesium.Viewer('cesiumContainer');

// // 创建一个实体
// const entity = viewer.entities.add({
//     // 常规属性
//     id: 'exampleEntity', // 实体的唯一标识符
//     name: 'Example Entity', // 实体的名称
//     description: 'This is an example entity.', // 实体的描述

//     // 位置属性
//     position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 100), // 实体的位置，可以使用 Cartesian3、SampledPositionProperty 等

//     // 姿态属性
//     orientation: Cesium.Transforms.headingPitchRollQuaternion(
//         Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 100),
//         new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0, 0)
//     ),

//     // 图形属性
//     billboard: { // 贴图属性
//         image: 'path/to/image.png', // 图片路径
//         scale: 1.0, // 缩放比例
//         color: Cesium.Color.WHITE, // 颜色
//         verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直对齐
//         horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平对齐
//     },
//     label: { // 标签属性
//         text: 'Example Label', // 标签文本
//         font: '24px Helvetica', // 字体样式
//         fillColor: Cesium.Color.WHITE, // 填充颜色
//         outlineColor: Cesium.Color.BLACK, // 边框颜色
//         outlineWidth: 2, // 边框宽度
//         style: Cesium.LabelStyle.FILL_AND_OUTLINE, // 标签样式
//     },
//     model: { // 模型属性
//         uri: 'path/to/model.glb', // 模型路径
//         minimumPixelSize: 128, // 最小像素大小
//         maximumScale: 20000, // 最大缩放比例
//     },
//     point: { // 点属性
//         pixelSize: 10, // 像素大小
//         color: Cesium.Color.YELLOW, // 颜色
//     },
//     polyline: { // 折线属性
//         positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]), // 折线位置
//         width: 5, // 线宽
//         material: Cesium.Color.RED, // 材质
//     },
//     polygon: { // 多边形属性
//            hierarchy: Cesium.Cartesian3.fromDegreesArray([
//                -115.0, 37.0,
//                -115.0, 32.0,
//                -107.0, 33.0,
//                -102.0, 31.0,
//                -102.0, 35.0
//            ]), // 多边形顶点位置
//         material: Cesium.Color.GREEN.withAlpha(0.5), // 材质
//     },
//     ellipse: { // 椭圆属性
//         semiMajorAxis: 50000.0, // 半长轴
//         semiMinorAxis: 30000.0, // 半短轴
//         material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.5)), // 材质
//     },
//     ellipsoid: { // 椭球属性
//         radii: new Cesium.Cartesian3(100000.0, 100000.0, 100000.0), // 半径
//         material: Cesium.Color.YELLOW.withAlpha(0.5), // 材质
//     },
//     corridor: { // 走廊属性
//         positions: Cesium.Cartesian3.fromDegreesArray([-90, 30, -85, 35, -80, 30]), // 走廊位置
//         width: 200000.0, // 走廊宽度
//         material: Cesium.Color.ORANGE.withAlpha(0.5), // 材质
//     },
//     wall: { // 墙属性
//         positions: Cesium.Cartesian3.fromDegreesArrayHeights([-115, 37, 1000, -115, 32, 1000]), // 墙位置和高度
//         material: Cesium.Color.BROWN.withAlpha(0.5), // 材质
//     },
//     path: { // 路径属性
//         resolution: 1, // 解析度
//         material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.1, color: Cesium.Color.YELLOW }), // 材质
//         width: 10, // 路径宽度
//         leadTime: 10, // 路径前导时间
//         trailTime: 60, // 路径尾随时间
//     },
//     availability: new Cesium.TimeIntervalCollection([ // 可用时间范围
//         new Cesium.TimeInterval({
//             start: Cesium.JulianDate.fromIso8601('2024-07-04T00:00:00Z'),
//             stop: Cesium.JulianDate.fromIso8601('2024-07-05T00:00:00Z')
//         })
//     ]),
// });

// viewer.zoomTo(entity);

