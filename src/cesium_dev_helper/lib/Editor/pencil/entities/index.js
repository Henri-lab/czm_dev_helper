import { SampleEntity } from './advanced/sample'
import { objHasOwnProperty, setProperties } from "../../../util/properties";
import { DrawingManager } from "../../../Manager";
import EntityScaffold from './EntityScaffold';


const createEntity = DrawingManager.createEntity;
function BoxEntity(extraOption = {}, options = {}, datasource = {}) {
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
function CorridorEntity(extraOption = {}, options = {}, datasource = {}) {
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
function CylinderEntity(extraOption = {}, options = {}, datasource = {}) {

    let entity = {}

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
    entity.cylinder = CylinderGraphics(options)

    // 将实体添加到图层
    return datasource.entities.add({
        ...extraOption,
        ...entity
    });

}
function EllipseEntity(extraOption = {}, options = {}, datasource = {}) {
    // 创建实体
    let entity = {}
    entity.ellipse = EllipseGraphics(options)
    const finalEntity = {
        ...extraOption,
        ...entity,
    };
    return datasource.entities.add(finalEntity)
}
function ModelEntity(extraOption = {}, options = {}, datasource = {}) {
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
function LineEntity(extraOption = {}, options = {}, datasource = {}) {
    if (options && options.positions) {
        // 直接添加Cesium.Entity
        // let czm_entity = createEntity()

        let entity = {};
        entity.polyline = LineGraphics(options)
        entity.polyline.scaleByDistance = options.scaleByDistance || new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e6, 0.5)//缩放
        entity.polyline.distanceDisplayCondition = options.distanceDisplayCondition || new Cesium.DistanceDisplayCondition(0.0, 1.5e7)//可视距离

        const finalEntity = {
            ...extraOption,
            ...entity,
        };

        return datasource.entities.add(finalEntity)
        //这个finalEntity 必须是一个普通对象
    }
}
function PointEntities(extraOption = {}, options = {}, datasource = {}) {
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
function PolygonEntity(extraOption = {}, options = {}, datasource = {}) {
    if (options) {
        let entity = {}
        entity.polygon = PolygonGraphics(options)
        entity.polygon.scaleByDistance = options.scaleByDistance || new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e6, 0.5)//缩放
        entity.polygon.distanceDisplayCondition = options.distanceDisplayCondition || new Cesium.DistanceDisplayCondition(0.0, 1.5e7)//可视距离
        const finalEntity = {
            ...extraOption,
            ...entity,
        };
        return datasource.entities.add(finalEntity)
    }
}







// 生成实体的坐标要采用Cartesian3
export {
    BoxEntity,
    CorridorEntity,
    EllipseEntity,
    LineEntity,
    ModelEntity,
    PointEntities,
    PolygonEntity,
    SampleEntity,
    objHasOwnProperty,
    setProperties,
    createEntity,//method in drawing manager

    EntityScaffold,
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

