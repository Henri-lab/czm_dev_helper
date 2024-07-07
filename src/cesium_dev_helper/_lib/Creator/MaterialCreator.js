import * as Cesium from "cesium";
import { add_ConeGlowBottomCircle, add_wallMaterial } from "../Custom/Materials/list";


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
                    add_ConeGlowBottomCircle(color);
                })()
                break;
            case 'wallgradients': {
                (function () {
                    let { color } = options
                    add_wallMaterial(color);
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

        // 遍历options的属性
        for (let key in options) {
            if (options.hasOwnProperty(key)) {
                // 存储在 Cesium.Material的属性
                Cesium.Material[key + '@henriFox'] = options[key];
            }
        }

        // 注册材质
        // 保证类型的唯一性
        const _type = options.type || 'customMaterial' + Date.now(),
            _uniforms = options.uniforms || {},
            _source = options.source || '',
            _translucent = options.translucent || true,
            _texture = options.texture || '';

        // 新版api?
        Cesium.Material._materialCache.addMaterial(_type, {
            fabric: {
                type: _type,
                uniforms: _uniforms,
                source: _source,
                translucent: function () {
                    return _translucent;
                }
            },
            // fabric 对象定义了材质的基本属性和行为,包括
            // -type: 自定义材质类型名称。
            // -uniforms: 包含颜色、图像和时间等 uniform 变量。
            // -components: 定义了材质的 diffuse, specular 和 normal 组件。
            // -source: 自定义 GLSL 着色器代码，用于生成材质效果。
            // -translucent: 使用函数动态控制材质的透明度。
            // -minificationFilter 和 magnificationFilter: 设置纹理的缩小和放大过滤方式。
        });
    }









}

