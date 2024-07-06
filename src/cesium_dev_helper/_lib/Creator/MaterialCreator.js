import * as Cesium from "cesium";


/**
 * 注册材质
 */

export default class MaterialCreator {
    constructor() { }

    addMaterial(materialName, options) {
        if (typeof materialName !== 'string') return

        const that = this, type = materialName.toLowerCase();
        switch (type) {
            // 自定义
            case 'custom':
                that.add_CustomMaterial(options);
                break;
            // 预置的自定义
            case 'coneglowbottomcircle':
                (function () {
                    let { color } = options
                    that.add_ConeGlowBottomCircle(color);
                })()
                break;
            case 'wallgradients': {
                (function () {
                    let { color } = options
                    that.add_wallMaterial(color);
                })()
                break;
            }
            default:
                throw new Error(`Unsupported material type: ${materialName}`);
        }
    }

    // 添加自定义材质 可以在Cesium.Material的属性中查找
    add_CustomMaterial(options) {
        if (!options.type) return;
        let _type = options.type || 'customMaterial' + Date.now(),
            _shaderSource = options.shaderSource || '',
            _image = options.image || '',
            _uniforms = options.uniforms || {};
        // 在Cesium.Material的属性中储存
        Cesium.Material[_type + 'Type'] = _type;
        Cesium.Material[_type + 'Source'] = _shaderSource
        Cesium.Material[_type + 'Image'] = _image
        // 注册材质
        Cesium.Material._materialCache.addMaterial(_type, {
            fabric: {
                type: _type,
                uniforms: _uniforms,
                image: _image,
            },
            source: _shaderSource,
            translucent: function () {
                return true;
            }
        });
    }









}

