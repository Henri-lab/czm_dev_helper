import * as Cesium from "cesium";
import MaterialCreator from '../../Creator/MaterialCreator'
import CustomMaterialProperty from "./CustomMaterialProperty";

// CMP - Custom Material Property
export default class CreateCMP extends CustomMaterialProperty {
    constructor(type, options, definition) {// definition - 定义如何基于时间动态生成材质属性
        // 自动注册的类型
        const _type = type || 'customMaterial'
        // @override

        const _definition = definition ||
            ((time) => {
                return {
                    color: Cesium.Color.fromCssColorString(Cesium.Color.RED)
                };
            })

        super(_definition, _type);
        // 帮助注册材质到Cesium.Material._materialCache的对象
        this.$register = new MaterialCreator();

        // 注册材质
        this._register(options);
    }

    // @override
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        // 调用父类的 getValue 以确保定义中的其他计算被执行💡
        const baseValue = super.getValue(time, result);

        // 获取特定自定义材质的属性
        Object.assign(result, baseValue);
        // 在MatrialCreator执行时 注册完毕的属性
        result.image = Cesium.Material[type + 'Image'];

        return result;
    }

    _register(options) {
        const opt = {
            type,
            source,
            uniforms
        } = options;

        this.$register.addMaterial('custom', opt);
    }
};