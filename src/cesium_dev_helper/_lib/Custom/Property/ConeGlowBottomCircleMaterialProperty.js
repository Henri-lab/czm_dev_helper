import * as Cesium from "cesium";
import MaterialCreator from '../../Creator/MaterialCreator'
import CustomMaterialProperty from "./CustomMaterialProperty";


export default class ConeGlowBottomCircleMaterialProperty extends CustomMaterialProperty {
    constructor(type,options, definition) {
        // 自动注册的类型
        const _type = type || 'ConeGlowBottomCircle'
        // @override
        const _definition = definition ||
            ((time) => {
                // 在此定义如何基于时间动态生成材质属性
                return {
                    color: Cesium.Color.fromCssColorString(color)
                };
            })

        super(_definition, _type);
        this.$register = new MaterialCreator();

        // 注册
        this._register();
    }

    // @override
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        // 调用父类的 getValue 以确保定义中的其他计算被执行💡
        const baseValue = super.getValue(time, result);

        // 获取特定自定义材质的属性
        result.color = baseValue.color;
        result.image = Cesium.Material.ConeGlowBottomCircleImage;

        return result;
    }

    _register() {
        const opt = {
            type,
            source,
            image,
            uniforms
        }
        this.$register.addMaterial('custom', opt);
    }
};