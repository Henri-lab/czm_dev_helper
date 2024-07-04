/**
   * 获取椭圆
   * @function
   * @param {object} options
   * @param {number} options.semiMajorAxis - 长半轴
   * @param {number} options.semiMinorAxis - 短半轴
   * @param {object} options.metarial - 材质
   * @param {boolean} options.outline - 是否显示外边线
   * @param {Object} options.outlineColor - 轮廓线颜色
   * @param {boolean} options.height - 高度
   * @returns {EllipseGraphics}   返回EllipseGraphics实例
   */
export function EllipseGraphics(options = {}) {

    if (options) {
        return new Cesium.EllipseGraphics({
            semiMajorAxis: options.semiMajorAxis || 1000.0,
            semiMinorAxis: options.semiMinorAxis || 1000.0,
            outlineColor: this._objHasOwnProperty(
                options,
                'outlineColor',
                Cesium.Color.RED
            ),
            height: options.height || 10,
            metarial: options.metarial || Cesium.Color.RED.withAlpha(0.5),
            outline: this._objHasOwnProperty(options, 'outline', true)
        })
    }
}
