import * as Cesium from "cesium";

// 函数工厂模式： new ConeGlowBottomCircleMaterialProperty(color);
export default function ConeGlowBottomCircleMaterialProperty(color) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
}
Object.defineProperties(ConeGlowBottomCircleMaterialProperty.prototype, {
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
    // color: Cesium.createPropertyDescriptor('color') 新版api
    
});
ConeGlowBottomCircleMaterialProperty.prototype.getType = function (time) {
    // Cesium 会根据 getType 方法返回的字符串来从材质缓存中取出对应的材质类型
    return 'ConeGlowBottomCircle';
};
ConeGlowBottomCircleMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.ConeGlowBottomCircleImage;
    return result;
};
ConeGlowBottomCircleMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof ConeGlowBottomCircleMaterialProperty &&
            Cesium.Property.equals(this._color, other._color));
};