// 在 Cesium 中实体的位置属性（position）通常在 graphics 属性外部设置，而不是嵌套在具体的 Graphics 属性中
// 位置数据都是通过顶层实体的 position 属性或特定的图形属性（如 positions 或 hierarchy）来设置的。这样设计的目的是为了统一管理实体的位置，使得图形属性可以专注于具体的图形绘制和外观控制。
// 特殊:polyline-positions ,corridor-positions,wall-positions, polygon-hierarchy,rectangle-coordinates等等:
import { objHasOwnProperty, setProperties } from "../../../util/properties";
import { createEntity } from "../entities";
import * as Cesium from 'cesium';


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
function BillboardGraphics(options = {}) {
    if (options.img) {
        return new Cesium.BillboardGraphics({
            ...options,
            image: options.img,
            width: options.width || 35,
            height: options.height || 35,
            clampToGround: options.clampToGround || true,
            scale: options.scale || 1,
            // eyeOffset :new Cesium.Cartesian2(0, -20),
            pixelOffset: options.pixelOffset || new Cesium.Cartesian2(0, -20),
            scaleByDistance: options.scaleByDistance || undefined
            // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
        })
    }
}
function BoxGraphics(options = {}) {
    return new Cesium.BoxGraphics({
        ...options,
        show: objHasOwnProperty(options, 'show', true),
        fill: objHasOwnProperty(options, 'fill', true),
        dimensions: options.dimensions || new Cesium.Cartesian3(0, 0, 0),
        material: options.material,
        outline: objHasOwnProperty(options, 'outline', true),
        outlineColor: options.outlineColor || Cesium.Color.BLACK,
        distanceDisplayCondition: options.distanceDisplayCondition || undefined
    })
}
function CorridorGraphics(options = {}) {
    return new Cesium.CorridorGraphics({
        ...options,
        positions: options.positions,
        width: options.width || 200000.0, // 走廊宽度（米）
        material: options.material || Cesium.Color.RED.withAlpha(0.5), // 走廊的颜色和透明度
        outline: options.outline || true, // 是否显示轮廓线
        outlineColor: options.outline || Cesium.Color.BLACK // 轮廓线颜色
    })
}
function CylinderGraphics(options = {}) {
    return new Cesium.CylinderGraphics({
        ...options,
        HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        length: options.length || 500 / 2,
        topRadius: options.topRadius || 0,
        bottomRadius: options.bottomRadius || 0,
        material: options.material || new Cesium.Color(0, 1, 1, 0.4),
        slices: options.slices || 128
    })
}
function EllipseGraphics(options = {}) {
    return new Cesium.EllipseGraphics({
        ...options,
        // 单位=米
        semiMajorAxis: options.semiMajorAxis || 10000.0,
        semiMinorAxis: options.semiMinorAxis || 10000.0,
        outlineColor: this._objHasOwnProperty(
            options,
            'outlineColor',
            Cesium.Color.RED
        ),
        height: options.height || 10,
        metarial: options.metarial || Cesium.Color.RED.withAlpha(0.5),
        outline: this._objHasOwnProperty(options, 'outline', true)
    })
}
function EllipsoidGraphics(options = {}) {
    let r = options.radii || 1000000.0 //默认100公里
    return new Cesium.EllipsoidGraphics({
        ...options,
        radii: new Cesium.Cartesian3(r, r, r), //单位 米
        innerRadii: objHasOwnProperty(
            options,
            'innerRadii',
            new Cesium.Cartesian3(r / 1.5, r / 1.5, r / 1.5)
        ),
        maximumCone: options.maximumCone || Cesium.Math.PI_OVER_TWO,
        stackPartitions: options.stackPartitions || 56,
        slicePartitions: options.slicePartitions || 56,
        outlineWidth: options.outlineWidth || 2.0,
        outlineColor: options.outlineColor || Cesium.Color.YELLOW,
        outline: objHasOwnProperty(options, 'outline', true),
        fill: objHasOwnProperty(options, 'fill', true),
        material: options.material || Cesium.Color.RED.withAlpha(0.1)
        //heightReference:Cesium.HeightReference.NONE,
    })
}
function LabelGraphics(options = {}) {
    if (options.text) {
        return new Cesium.LabelGraphics({
            ...options,
            // 文字标签
            text: options.text,
            font: options.font || '14px sans-serif',
            fillColor: options.fillColor || Cesium.Color.GOLD,
            style: options.style || Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: options.outlineWidth || 2,
            showBackground: options.showBackground || false,
            backgroundColor:
                options.backgroundColor || new Cesium.Color(0.165, 0.165, 0.165, 0.8),
            verticalOrigin:
                options.verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: options.pixelOffset || new Cesium.Cartesian2(0, -30)
            // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        })
    }
}
function LineGraphics(options = {}) {
     return new Cesium.PolylineGraphics({
        ...options,
        show: true,
        positions: options.positions || [],
        material: options.material || Cesium.Color.YELLOW,
        width: options.width || 1,
        clampToGround: objHasOwnProperty(options, 'clampToGround', false)
    })
}
function ModelGraphics(options = {}) {
    return new Cesium.ModelGraphics({
        ...options,
        uri: options.m_url || options.url,
        scale: options.m_scale || options.scale || 10,
        clampAnimations: true
    })
}
function PathGraphics(options = {}) {
    return new Cesium.PathGraphics({
        ...options,
        resolution: options.resolution || 1,
        //设置航线样式，线条颜色，内发光粗细，航线宽度等
        material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: options.glowPower || 0.1,
            color: options.color || Cesium.Color.YELLOW
        }),
        width: options.width || 10
    })
}
function PlaneGraphics(options = {}) {
    return new Cesium.PlaneGraphics({
        ...options,
        plane: options.plane || new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0), // PlaneGraphics 的一个属性是 Plane 
        dimensions: options.dimensions || new Cesium.Cartesian2(100.0, 100.0),
        material: options.material || Cesium.Color.RED.withAlpha(0.5), // 走廊的颜色和透明度
        outline: options.outline || true, // 是否显示轮廓线
        outlineColor: options.outline || Cesium.Color.BLACK, // 轮廓线颜色
        distanceDisplayCondition: options.distanceDisplayCondition || undefined,
        shadows: options.shadows || Cesium.ShadowMode.DISABLED // 投影模式
    })
}
function PointGraphics(options = {}) {
    return new Cesium.PointGraphics({
        ...options,
        color: options.color || Cesium.Color.GREEN,
        pixelSize: options.pixelSize || 5,
        outlineColor: options.outlineColor || Cesium.Color.WHITE,
        outlineWidth: options.outlineWidth || 1
    })
}

function PolygonGraphics(options = {}) {

    if (options.positions) {
        return new Cesium.PolygonGraphics({
            ...options,
            hierarchy: {
                // cartesian3
                positions: options.positions
            },
            material: options.material || Cesium.Color.RED.withAlpha(0.2),
            clampToGround: options.clampToGround || false
        })
    }
}

function RectangleGraphics(options = {}) {
    if (!Array.isArray(options.positions)) throw new TypeError("arg.positions must be an array")
    const w_s_e_n = new Cesium.Rectangle.fromCartesianArray(options.positions)
    return new Cesium.RectangleGraphics({
        // 后面的属性会覆盖前面的属性值
        ...options,
        coordinates: w_s_e_n,
        color: options.color || Cesium.Color.GREEN,
        pixelSize: options.pixelSize || 5,
        outlineColor: options.outlineColor || Cesium.Color.WHITE,
        outlineWidth: options.outlineWidth || 1
    })
}

















export {
    createEntity,
    objHasOwnProperty,
    setProperties,
    getMethodNameByType,

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
    RectangleGraphics,
};


