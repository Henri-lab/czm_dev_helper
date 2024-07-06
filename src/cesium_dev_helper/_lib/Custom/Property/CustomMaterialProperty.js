import * as Cesium from "cesium";

/** 
 * 自定义材质属性
 * @param {function} definition - callback(time) when getValue
 * @param {string} type - material type name
*/
export default class CustomMaterialProperty {
    constructor(definition, type) {
        this._definitionChanged = new Cesium.Event();
        this._value = undefined; // Store the property value
        this._definition = definition; // Store the property definition
        this._type = type; // Store the material type name
    }

    // 新类型
    create(definitionChanged, type) {
        return new CustomMaterialProperty(definitionChanged, type);
    }

    // 核心
    get isConstant() {
        return false;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        const oldValue = this._value;
        if (oldValue !== value) {
            this._value = value;
            this._definitionChanged.raiseEvent(this, 'value');
        }
    }

    getType(time) {
        return this._type; // Return a custom type name
    }

    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        // Use the provided definition to calculate the property value
        result.value = this._definition(time);

        return result;
    }

    equals(other) {
        return this === other ||
            (other instanceof CustomMaterialProperty &&
                Cesium.Property.equals(this._value, other._value));
    }
}




