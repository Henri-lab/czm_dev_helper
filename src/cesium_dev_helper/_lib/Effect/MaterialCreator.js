import {
    Cesium,
    ConeGlowBottomCircleMaterialProperty,
    WallGradientsMaterialProperty,
    TextureCreator,
    circleMapping_glsl,
    wallMapping_glsl
} from './index.js'


/**
 * 注册材质并返回材质
 */
class MaterialCreator {
    constructor() { }

    register(materialName, options) {
        if (typeof materialName !== 'string') return
        const type = materialName.toLowerCase();
        switch (type) {
            case 'coneglowbottomcircle':
                (function () {
                    let { color } = options
                    return this._ConeGlowBottomCircle(color);
                })()
            case 'wallgradients': {
                (function () {
                    let { color } = options
                    return this._wallMaterial(color);
                })()
            }
            default:
                throw new Error(`Unsupported material type: ${materialName}`);
        }
    }

    // 添加新材质- ConeGlowBottomCircle
    _ConeGlowBottomCircle(color) {
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
    _wallMaterial(color) {
        Cesium.Material.WallGradientsType = "WallGradients";
        Cesium.Material.WallGradientsImage = "/src/assets/materialResources/wallgradients.png";
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