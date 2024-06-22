import ConeGlowBottomCircleMaterialProperty from "../Custom/Property/ConeGlowBottomCircleMaterialProperty";
import WallGradientsMaterialProperty from "../Custom/Property/WallGradientsMaterialProperty";
import TextureCreator from './TextureCreator';
import circleMapping_glsl from './glsl/circleMapping_glsl';
import wallMapping_glsl from './glsl/wallMapping.glsl';
import * as Cesium from "cesium";


/**
 * 注册材质并返回材质
 */
class MaterialCreator {
    constructor() { }
    // 添加新材质- ConeGlowBottomCircle
    ConeGlowBottomCircle(color) {
        Cesium.Material.ConeGlowBottomCircleType = 'ConeGlowBottomCircle';
        Cesium.Material.ConeGlowBottomCircleImage = new TextureCreator().gradientTexture({});
        Cesium.Material.ConeGlowBottomCircleSource = circleMapping_glsl;
        // 注册材质
        Cesium.Material._materialCache.addMaterial(Cesium.Material.ConeGlowBottomCircleType, {
            fabric: {
                type: Cesium.Material.ConeGlowBottomCircleType,
                uniforms: {
                    color,
                    image: Cesium.Material.ConeGlowBottomCircleImage,
                },
                source: Cesium.Material.ConeGlowBottomCircleSource
            },
            translucent: function () {
                return true;
            }
        });
        // 返回材质
        return new ConeGlowBottomCircleMaterialProperty(color);
    }
    // 添加新材质- wallMaterial
    wallMaterial(color) {
        Cesium.Material.WallGradientsType = "WallGradients";
        Cesium.Material.WallGradientsImage =
            "/src/assets/materialResources/wallgradients.png";
        Cesium.Material.WallGradientsSource = wallMapping_glsl;
        // 注册材质
        Cesium.Material._materialCache.addMaterial(Cesium.Material.WallGradientsType, {
            fabric: {
                type: Cesium.Material.WallGradientsType,
                uniforms: {
                    color,
                    image: Cesium.Material.WallGradientsImage,
                },
                source: Cesium.Material.WallGradientsSource,
            },
            translucent: function () {
                return true;
            },
        });
        // 返回材质
        return new WallGradientsMaterialProperty(color);
    }
}


export default MaterialCreator;