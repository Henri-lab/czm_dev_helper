import { Cesium, Ripple_glsl } from "./index.js";

class GeometryCreater {
    constructor(viewer) {
        this.viewer = viewer;
        this.scene = viewer.scene;
    }

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
    lightCone(options) {
        const position = Cesium.defaultValue(
            options.position,
            Cesium.Cartesian3.ZERO
        );
        const height = Cesium.defaultValue(options.height, 700);
        const bottomRadius = Cesium.defaultValue(options.bottomRadius, 100);
        const color = Cesium.defaultValue(options.color, Cesium.Color.AQUA);
        const modelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(position),
            new Cesium.Cartesian3(0.0, 0.0, height * 0.5),
            new Cesium.Matrix4()
        );

        const cylinderGeometry = new Cesium.CylinderGeometry({
            length: height,
            topRadius: 0.0,
            bottomRadius: bottomRadius * 0.7,
            vertexFormat:
                Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
        });

        const cone = new Cesium.GeometryInstance({
            geometry: cylinderGeometry,
            modelMatrix: modelMatrix,
        });

        const primitive = new Cesium.Primitive({
            geometryInstances: [cone],
            appearance: new Cesium.MaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: "Ripple",
                        uniforms: {
                            color,
                        },
                        source: Ripple_glsl,
                    },
                    translucent: false,
                }),
                faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
                closed: true, // 是否为封闭体，实际上执行的是是否进行背面裁剪
            }),
        })
        const res = this.scene.primitives.add(
            primitive
        );
        return res
    }

}

export default GeometryCreater;