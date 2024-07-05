import { Viewer, Cartesian3, Matrix4, Transforms, CylinderGeometry, MaterialAppearance, Material, Color } from 'cesium';
import { objHasOwnProperty } from '../../../util/properties';
import Geometry from '../Geometry';


// 圆柱是特殊的圆锥 ~ 圆是特殊的椭圆
/**
    * Creates a light cone (or light cylinder) in the 3D scene.   光柱(光锥)
    *
    * @param {Object} options - The options for creating the light cone.
    * @param {Cartesian3} [options.position=Cartesian3.ZERO] - The position of the light cone in the 3D scene.
    * @param {Number} [options.height=700] - The height of the light cone.
    * @param {Number} [options.bottomRadius=100] - The bottom radius of the light cone.
    * @param {Color} [options.color=Color.AQUA] - The color of the light cone.
    * @returns {Primitive} - The created light cone primitive.
    */
// vertexFormat 是 Cesium.Geometry 或者 Cesium.GeometryInstance 对象的一个属性，用于指定顶点属性的格式。
// 它定义了几何体的顶点数据包含哪些属性，例如位置、法线、纹理坐标、颜色等。
// 当使用 MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat 时，
// 说明顶点格式包括了位置、法线和纹理坐标。这是为了确保几何体能够正确地映射和显示纹理。

// MaterialAppearance
// MaterialAppearance 是 Cesium 提供的一种外观类，用于将材质应用到几何体上。
// MaterialAppearance 支持多种材质，并且可以通过指定 MaterialSupport 来定义材质支持的顶点属性格式。

// MaterialSupport
// MaterialSupport 是一个枚举，定义了材质所需的顶点属性格式。主要有以下几种：
// --BASIC：仅支持基本的顶点属性，例如位置和法线。
// --TEXTURED：支持纹理坐标，用于应用纹理。
// --ALL：支持所有可能的顶点属性，包括位置、法线、纹理坐标和颜色。

// 同一个顶点数组（attributes）的 vertexFormat 不同，会导致这些顶点数据被解析为不同的行为。
// vertexFormat 指定了几何体的顶点数据包含哪些属性，并且每种格式定义了这些属性的布局。
// 以下是几种常见的 vertexFormat 和它们的行为解释：
// -Cesium.VertexFormat.POSITION_ONLY：只包含顶点的位置属性。
// ----用途：仅绘制几何体的基本形状，不涉及光照或纹理。
// -Cesium.VertexFormat.POSITION_AND_NORMAL：包含顶点的位置和法线属性。
// ----用途：用于光照计算，几何体表面可以正确地响应光源。
// -Cesium.VertexFormat.POSITION_AND_ST：包含顶点的位置和纹理坐标（ST）。
// ----用途：用于纹理映射，将图像纹理应用到几何体表面。
// -Cesium.VertexFormat.POSITION_AND_COLOR：包含顶点的位置和颜色属性。
// ----用途：每个顶点具有独立的颜色，用于顶点着色。
// -Cesium.VertexFormat.ALL：包含所有可能的顶点属性：位置、法线、纹理坐标和颜色。
// ----用途：复杂的渲染效果，结合光照、纹理和颜色。

export default function lightCone(options, viewer) {
    const geometryModule = new Geometry(viewer);
    const position = objHasOwnProperty(options.position, Cartesian3.ZERO);
    const height = objHasOwnProperty(options.height, 700);
    const bottomRadius = objHasOwnProperty(options.bottomRadius, 100);
    const color = objHasOwnProperty(options.color, Color.AQUA);

    const modelMatrix = Matrix4.multiplyByTranslation(
        Transforms.eastNorthUpToFixedFrame(position),
        new Cartesian3(0.0, 0.0, height * 0.5),
        new Matrix4()
    );
    const cylinderOptions = {
        length: height,
        topRadius: 0.0,
        bottomRadius: bottomRadius,
        vertexFormat: MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
        // MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat 的值是 Cesium.VertexFormat.POSITION_AND_ST，
        // 它定义了顶点数据包含位置和纹理坐标两种属性。这种格式是合理的并且常用于具有纹理的几何体，例如带纹理的圆柱体。
    }
    const cylinderGeometry = geometryModule.GeometryByType('cylinder', cylinderOptions)

    const geometryInstance = geometryModule.GeometryInstance(cylinderGeometry, modelMatrix, color);

    const appearanceOptions = {
        // material 的 fabric 对象中的 type 属性在 Cesium 中是非常重要的，它指示了材质的类型。

        // Cesium 内置了几种材质类型，例如 Color, Image, Diffuse, Specular, NormalMap，以及 Grid 等等。

        // 自定义材质时，type 可以是任意的字符串，但最好选择一个描述性强的名称，以便代码更具可读性和可维护性。
        // 如果 type 是自定义的，则还需要提供 source 着色器代码来定义材质的行为。
        material: {
            fabric: {
                type: "lightCone",
                uniforms: {
                    color,
                },
                source: `
                    uniform vec4 color;
                    czm_material czm_getMaterial(czm_materialInput materialInput) {
                        czm_material material = czm_getDefaultMaterial(materialInput);
                        material.diffuse = color.rgb;
                        material.alpha = color.a;
                        return material;
                    }
                `
            },
            translucent: false,
        },
        //控制几何体的法线方向。如果为 true，法线将始终朝向摄像机，这在处理双面材质时很有用。
        faceForward: false,
        //指示几何体是否封闭（例如，圆柱体的顶部和底部是否封闭）。
        closed: true,

        // 圆柱体的顶部和底部是否封闭，主要影响几何体的完整性和渲染效果。
        // 封闭的圆柱体和不封闭的圆柱体在以下几个方面存在本质区别：
        // 1. 几何体的完整性
        // --封闭的圆柱体：
        // --顶部和底部都有面，使几何体成为一个完整的三维实体。
        // --用于表示实心物体，比如柱子或罐子。
        // --不封闭的圆柱体：
        // --顶部和/ 或底部没有面，只是一个空心的管子或环。
        // --用于表示中空或部分开放的物体，比如管道或戒指。
        // 2. 渲染效果
        // --封闭的圆柱体：
        // --因为顶部和底部都有面，可以更好地处理光照和阴影。
        // --更适合需要显示完整表面的情况。
        // --不封闭的圆柱体：
        // -- 顶部和底部没有面，光照和阴影效果可能看起来不完整或不准确。
        // --更适合需要展示内部结构或开放的物体。
        // 3. 应用场景
        // --封闭的圆柱体：
        // --适用于需要完全封闭的物体，例如建筑柱子、罐子、容器等。
        // --不封闭的圆柱体：
        // --适用于需要展示内部的物体，例如管道、烟囱、开放的容器等。
    };

    const primitive = geometryModule.Primitive(geometryInstance, appearanceOptions);
    return primitive;
}
