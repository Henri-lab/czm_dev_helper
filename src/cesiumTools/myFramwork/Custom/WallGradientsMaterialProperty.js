//渐变墙体材质  color 颜色
export default function WallGradientsMaterialProperty(color) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
}
Object.defineProperties(WallGradientsMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        },
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        },
    },
    color: Cesium.createPropertyDescriptor("color"),
});
WallGradientsMaterialProperty.prototype.getType = function (time) {
    return "WallGradients";
};
WallGradientsMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
    );
    result.image = Cesium.Material.WallGradientsImage;
    return result;
};
WallGradientsMaterialProperty.prototype.equals = function (other) {
    return (
        this === other ||
        (other instanceof WallGradientsMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
    );
};