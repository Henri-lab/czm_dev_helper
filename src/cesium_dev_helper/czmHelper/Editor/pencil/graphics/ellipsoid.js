/**
   * 获取球
   * @function
   * @param {object} options
   * @param {number} options.radii - 半径
   * @param {number} options.innerRadii - 内球半径
   * @param {number} options.maximumCone - 椭圆最大角度
   * @param {number} options.stackPartitions - 垂直分段数
   * @param {number} options.slicePartitions - 平行分段数
   * @param {number} options.outlineWidth -外边线宽度
   * @param {object} options.outlineColor - 外边线颜色
   * @param {boolean} options.outline - 是否显示外边线
   * @param {boolean} options.fill - 是否填充
   * @param {boolean} options.material - 材质
   * @returns {EllipsoidGraphics}  返回EllipsoidGraphics实例
   */
export function EllipsoidGraphics(options) {
    options = options || {}
    if (options) {
        let r = options.radii || 1000000.0 //默认100公里
        return new Cesium.EllipsoidGraphics({
            radii: new Cesium.Cartesian3(r, r, r), //单位 米
            innerRadii: this._objHasOwnProperty(
                options,
                'innerRadii',
                new Cesium.Cartesian3(r / 1.5, r / 1.5, r / 1.5)
            ),
            maximumCone: options.maximumCone || Cesium.Math.PI_OVER_TWO,
            stackPartitions: options.stackPartitions || 56,
            slicePartitions: options.slicePartitions || 56,
            outlineWidth: options.outlineWidth || 2.0,
            outlineColor: options.outlineColor || Cesium.Color.YELLOW,
            outline: this._objHasOwnProperty(options, 'outline', true),
            fill: this._objHasOwnProperty(options, 'fill', true),
            material: options.material || Cesium.Color.RED.withAlpha(0.1)
            //heightReference:Cesium.HeightReference.NONE,
        })
    }
}
