import ConeGlowBottomCircleMaterialProperty from "../Custom/ConeGlowBottomCircleMaterialProperty";
import TextureCreator from './TextureCreator';
import Mapping_glsl from './glsl/Mapping_glsl';
import * as Cesium from "cesium";

class MaterialCreator {
    constructor() { }
    // 添加新材质- ConeGlowBottomCircle
    ConeGlowBottomCircle(color) {
        Cesium.Material.ConeGlowBottomCircleType = 'ConeGlowBottomCircle';
        Cesium.Material.ConeGlowBottomCircleImage = new TextureCreator().gradientTexture({});
        Cesium.Material.ConeGlowBottomCircleSource = Mapping_glsl;
        Cesium.Material._materialCache.addMaterial(Cesium.Material.ConeGlowBottomCircleType, {
            fabric: {
                type: Cesium.Material.ConeGlowBottomCircleType,
                uniforms: {
                    color,
                    image: Cesium.Material.ConeGlowBottomCircleImage,
                    time: 0
                },
                source: Cesium.Material.ConeGlowBottomCircleSource
            },
            translucent: function (material) {
                return true;
            }
        });
        return new ConeGlowBottomCircleMaterialProperty(color);
    }
}


export default MaterialCreator;