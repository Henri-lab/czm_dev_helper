/**
   *获取线图形
   * @function
   * @param {object} options
   * @param {Cartesian3} options.positions - 绘制线图形的坐标数组
   * @param {object} options.material - 配置线段材质
   * @param {number} options.width - 线宽
   * @param {boolean} options.clampToGround - 是否贴地
   * @returns {PolylineGraphics}   返回PolylineGraphics实例
   */
export function LineGraphics(options) {
    options = options || {}
    if (options && options.positions) {
        return new Cesium.PolylineGraphics({
            show: true,
            positions: options.positions,
            material: options.material || Cesium.Color.YELLOW,
            width: options.width || 1,
            clampToGround: this._objHasOwnProperty(options, 'clampToGround', false)
        })
    }
}