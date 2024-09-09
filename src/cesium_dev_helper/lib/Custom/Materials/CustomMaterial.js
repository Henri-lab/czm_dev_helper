import * as Cesium from "cesium";

export default class CustomMaterial {
    constructor(type, options, definition) {
        // 自动注册的材质类型，如果未提供则使用默认值
        const _type = type || 'customMaterial@henrifox';

        // 定义如何基于时间动态生成材质属性
        const _definition = definition || ((time) => {
            return {
                color: Cesium.Color.RED // 使用 Cesium 提供的颜色类，直接用 Cesium.Color.RED
            };
        });

        // 调用父类构造函数
        // super(_definition, _type);

        // 初始化材质对象
        this.materials = {};

        // 自动注册材质
        this.registerMaterial(options);
    }

    // 覆写 getValue 方法
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        // 调用父类的 getValue 方法，执行基础的材质计算
        const baseValue = super.getValue(time, result);

        // 将父类计算的值和自定义属性合并
        Object.assign(result, baseValue);

        // 在注册时，将图像存储为 Cesium.Material 的属性
        result.image = Cesium.Material[this._type + 'Image'];

        return result;
    }

    // 注册材质
    registerMaterial(options) {
        // 验证 options.type 是否为字符串
        if (typeof options.type !== 'string') {
            console.error('Invalid material type provided');
            return;
        }

        // 注册自定义材质
        this._addCustomMaterial(options);
    }

    // 内部方法：添加自定义材质
    _addCustomMaterial(options) {
        // 遍历 options 的属性
        for (let key in options) {
            if (options.hasOwnProperty(key)) {
                // 注册材质到 Cesium.Material 上
                Cesium.Material[key + '@henriFox'] = options[key];
            }
        }

        // 材质的类型、uniforms、source、translucent 和 texture 信息
        const _type = options.type || 'customMaterial' + Date.now(),
              _uniforms = options.uniforms || {},
              _source = options.source || '',
              _translucent = options.translucent || true;

        // 新版 API 的材质注册
        Cesium.Material._materialCache.addMaterial(_type, {
            fabric: {
                type: _type,
                uniforms: _uniforms,
                source: _source,
                translucent: function () {
                    return _translucent;
                }
            }
        });
    }
};
