import * as Cesium from "cesium";
/** 
 * 自定义材质属性
 * @param {function} definition - callback(time) when getValue
 * @param {string} type - material type name
*/
export default function CustomMaterialProperty(definition, type) {
    function CustomMaterialProperty(definition) {
        this._definitionChanged = new Cesium.Event();
        this._value = undefined; // Store the property value
        this._definition = definition; // Store the property definition
    }

    Object.defineProperties(CustomMaterialProperty.prototype, {
        isConstant: {
            get: function () {
                return false;
            }
        },
        definitionChanged: {
            get: function () {
                return this._definitionChanged;
            }
        },
        value: Cesium.createPropertyDescriptor('value')
    });

    CustomMaterialProperty.prototype.getType = function (time) {
        return type; // Return a custom type name
    };

    CustomMaterialProperty.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        // Use the provided definition to calculate the property value
        result.value = this._definition(time);

        return result;
    };

    CustomMaterialProperty.prototype.equals = function (other) {
        return this === other ||
            (other instanceof CustomMaterialProperty &&
                Cesium.Property.equals(this._value, other._value));
    };

    return new CustomMaterialProperty(definition);
}

// // 使用示例
// let myMaterialProperty = CustomMaterialProperty(function (time) {
//     // Define how the property value is calculated
//     // For example, return a color that changes over time
//     return Cesium.Color.fromRandom();
// });
