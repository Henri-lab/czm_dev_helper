/**
  * 获取盒子图形
  * @function
  * @param {object} options
  * @param {boolean} options.show - 是否显示
  * @param {object} options.dimensions - 盒子长宽高
  * @param {object} options.distanceDisplayCondition - 显示条件
  * @param {object} options.outlineColor - 外边线颜色
  * @param {boolean} options.outline - 是否显示外边线
  * @param {boolean} options.fill - 是否填充
  * @param {boolean} options.material - 材质
  * @returns {BoxGraphics} 返回BoxGraphics实例
  */
export function BoxGraphics(options) {
    options = options || {}
    if (options) {
        return new Cesium.BoxGraphics({
            show: this._objHasOwnProperty(options, 'show', true),
            fill: this._objHasOwnProperty(options, 'fill', true),
            dimensions: options.dimensions || new Cesium.Cartesian3(0, 0, 0),
            material: options.material,
            outline: this._objHasOwnProperty(options, 'outline', true),
            outlineColor: options.outlineColor || Cesium.Color.BLACK,
            distanceDisplayCondition: options.distanceDisplayCondition || undefined
        })
    }
}