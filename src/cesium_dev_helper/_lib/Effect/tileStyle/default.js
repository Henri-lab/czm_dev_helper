import * as Cesium from "cesium";

// tileStyle 分别由cesium的配置选项和自定义shader生成

const defaultStyle = new Cesium.Cesium3DTileStyle({
    color: {
        conditions: [
            ["Number(${Elevation})<5", "color('rgb(25, 211, 226)',0.0)"],
            ["Number(${Elevation})>10", "color('rgb(25, 211, 226)',1)"],
            //['true', "color('rgb(42, 122, 237)',1)"]
        ],
        show: false,
    },
});

// Apply a custom shader to the 3D tileset for more advanced effects
const defaultShader = new Cesium.CustomShader({
    uniforms: {
        maxHeight: {
            type: Cesium.UniformType.FLOAT,
            value: 660.0,
        },
        minHeight: {
            type: Cesium.UniformType.FLOAT,
            value: 520.0,
        },
    },
    mode: Cesium.CustomShaderMode.MODIFY_MATERIAL,
    lightingModel: Cesium.LightingModel.PBR,
    vertexShaderText: /*glsl*/ `
            void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {

            }
       `,
    fragmentShaderText: /*glsl*/ `
            void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
                vec3 positionMC = fsInput.attributes.positionMC;
            
                // Note: Float values in shader should be written with decimal point, otherwise it will throw an error. For example, 0 should be written as 0.0, 1 as 1.0.
                float _baseHeight = minHeight; // The base height of the building, needs to be adjusted to a suitable value.
                float _heightRange = maxHeight; // The range for highlighting (_baseHeight ~ _baseHeight + _heightRange)
                float _glowRange = maxHeight; // The range for the glowing effect (height)
                // Base color of the building
                float czm_height = positionMC.y - _baseHeight -65.0;
                float baseColor = czm_height / _heightRange;
                float bottomColor= czm_height / _heightRange*2.0;
                // Give the roof a fixed color to add volume
                if(czm_height<29.0) {
                    material.diffuse *= vec3(bottomColor);
                }else{
                  material.diffuse *= vec3(baseColor); // Gradient
                }
            }
         `,
});

export {
    defaultStyle,
    defaultShader,
};
