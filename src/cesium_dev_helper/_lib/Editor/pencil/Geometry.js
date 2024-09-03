// geometry/Geometry.js
import * as Cesium from 'cesium';
import { DrawingManager } from '../../Manager';
import lightCone from './primitives/lightCone';

export default class Geometry extends DrawingManager {
    constructor(viewer) {
        console.log('new Geometry class')
        super(viewer);
        this.scene = viewer.scene;
    }

    // 创建几何属性 默认为三角形
    // 自定义 Geometry 更加灵活，可以用于任意形状，但需要手动管理顶点和索引。

    // 解释:
    //     componentDatatype：
    //     含义：指定顶点数据的基本数据类型。
    //     默认值：Cesium.ComponentDatatype.DOUBLE，表示顶点数据为双精度浮点数（64位）。
    //     说明：如果 options.componentDatatype 未提供，将使用 Cesium.ComponentDatatype.DOUBLE 作为默认值。

    //     Cesium.ComponentDatatype 是一个枚举类型，可以是以下值之一：
    //          -- Cesium.ComponentDatatype.BYTE: 8位有符号整数
    //          -- Cesium.ComponentDatatype.UNSIGNED_BYTE: 8位无符号整数
    //          -- Cesium.ComponentDatatype.SHORT: 16位有符号整数
    //          -- Cesium.ComponentDatatype.UNSIGNED_SHORT: 16位无符号整数
    //          -- Cesium.ComponentDatatype.INT: 32位有符号整数
    //          -- Cesium.ComponentDatatype.UNSIGNED_INT: 32位无符号整数
    //          -- Cesium.ComponentDatatype.FLOAT: 32位浮点数
    //          -- Cesium.ComponentDatatype.DOUBLE: 64位浮点数

    //     componentsPerAttribute
    //     含义：指定每个顶点属性包含的组件数量。
    //     默认值：3，表示每个顶点由3个组件组成（例如，x、y、z 三个坐标）。
    //     说明：如果 options.componentsPerAttribute 未提供，将使用 3 作为默认值。通常，对于位置数据，每个顶点包含三个组件（x、y、z 坐标），因此默认值为 3。

    //     values：
    //     含义：顶点属性的数据数组。
    //     说明：options.values 是一个包含所有顶点数据的数组。
    //          数组的长度应该是 componentsPerAttribute 的倍数。例如，如果 componentsPerAttribute 为 3，并且有 4 个顶点，那么 values 数组的长度应为 12（4 * 3）。

    //     PrimitiveType 枚举定义了几种基本的图元类型，用于指定如何将顶点连接成图元。主要有以下几种类型：
    //     -- POINTS：每个顶点表示一个点。
    //     -- LINES：每两个顶点组成一条线段。
    //     -- LINE_LOOP：顶点按顺序连接成一条闭合的线段。
    //     -- LINE_STRIP：顶点按顺序连接成一条折线，每个顶点与前一个顶点相连。
    //     -- TRIANGLES：每三个顶点组成一个三角形。
    //     -- TRIANGLE_STRIP：顶点按顺序连接成一条连续的三角带，每三个顶点组成一个三角形，除了第一个三角形，后续的三角形共享前一个三角形的两个顶点。
    //     -- TRIANGLE_FAN：第一个顶点为公共顶点，后续顶点按顺序与前一个顶点和第一个顶点组成三角形。
    CustomGeometry(options) {
        // 数据格式检测 --倍数?
        if (options.positions.length % options.componentsPerAttribute !== 0) {
            console.warn('The amount of data points is invalid')
            return null;
        }

        const geometry = new Cesium.Geometry({
            // 几何体的顶点属性
            attributes: {
                position: new Cesium.GeometryAttribute({
                    // component --分量?
                    componentDatatype: options.componentDatatype || Cesium.ComponentDatatype.DOUBLE,//一个INT值
                    componentsPerAttribute: options.componentsPerAttribute || 3,
                    values: options.positions
                })
            },
            // 顶点的索引，表示如何将顶点连接成图元
            indices: options.indices,
            // 几何体的基本图元类型
            primitiveType: options.primitiveType || Cesium.PrimitiveType.TRIANGLES,
            // 用于快速进行碰撞检测和视锥剔除
            boundingSphere: Cesium.BoundingSphere.fromVertices(options.positions)
        });
        return geometry;
    }

    // 使用 更明确的XxxGeometry，您不需要手动指定顶点和索引，Cesium 会自动为您生成这些数据。
    GeometryByType(type, options) {
        let geometry;
        switch (type.toLowerCase()) {
            case 'box':
                geometry = new Cesium.BoxGeometry(options);
                break;
            case 'cylinder':
                geometry = new Cesium.CylinderGeometry(options);
                break;
            case 'ellipsoid':
                geometry = new Cesium.EllipsoidGeometry(options);
                break;
            case 'sphere':
                geometry = new Cesium.SphereGeometry(options);
                break;
            case 'plane':
                geometry = new Cesium.PlaneGeometry(options);
                break;
            // ...更多几何类型
            default:
                throw new Error('Unsupported geometry type');
        }
        return geometry;
    }
    // 创建几何实例
    GeometryInstance(geometry, modelMatrix, color) {
        const instance = new Cesium.GeometryInstance({
            geometry: geometry,
            modelMatrix: modelMatrix,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
            }
        });
        return instance;
    }

    // 创建图元
    Primitive(instance, appearanceOptions) {
        const primitive = new Cesium.Primitive({
            geometryInstances: instance,
            // Cesium.PerInstanceColorAppearance 用于每个实例具有不同颜色的简单渲染需求。批量绘制
            // Cesium.Appearance 则更为通用，用于实现复杂的几何体渲染，支持纹理、材质和高级的光照效果。

            //  --Cesium.Appearance 👺VS👀 Cesium.MaterialAppearance--
            // Cesium.Appearance 本身并不是用来定义材质的。需要下级的类
            // 如Cesium.MaterialAppearance,或Cesium.EllipsoidSurfaceAppearance...等 来定义自定义几何体外观。
            appearance: new Cesium.MaterialAppearance({
                ...appearanceOptions
            })
        });

        this.scene.primitives.add(primitive);
        return primitive;
    }

    customPrimitive(type, options) {
        let viewer = this.viewer
        const _type = type.toLowerCase();
        switch (_type) {
            case 'mylightcone':
                return lightCone(options, viewer);
            //...更多几何类型
            default:
                throw new Error('Unsupported primitive type');
        }
    }
}




