import * as Cesium from "cesium";

class GeometryCreater {
    constructor(viewer) {
        this.viewer = viewer;
        this.scene = viewer.scene;
        this.entities = viewer.entities;
    }

    // 光柱(光锥)
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
                        type: "VtxfShader1",
                        uniforms: {
                            color: color,
                        },
                        source: /*glsl*/ `
                          uniform vec4 color;   
                          czm_material czm_getMaterial(czm_materialInput materialInput)
                          {
                              czm_material material = czm_getDefaultMaterial(materialInput);
                              vec2 st = materialInput.st;
                              float time=fract(czm_frameNumber/10.0);
                              float isAlpha=step(0.5,time);
                              float dis = distance(st, vec2(0.5)); 
                              material.diffuse =1.9 * color.rgb;
                              if(isAlpha>=1.0){
                                  material.alpha = color.a * dis *2.0;
                              }else{
                                  material.alpha = color.a * dis *1.5;
                              }

                              return material;
                          }
                      `,
                    },
                    translucent: false,
                }),
                faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
                closed: true, // 是否为封闭体，实际上执行的是是否进行背面裁剪
            }),
        })
        const res = viewer.scene.primitives.add(
            primitive
        );
        return res
    }
}