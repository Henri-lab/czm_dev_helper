/**
   *获取面图形
   * @function
   * @param {object} options
   * @param {Cartesian3} options.positions - 绘制线图形的坐标数组
   * @param {object} options.material - 配置线段材质
   * @param {boolean} options.clampToGround - 是否贴地
   * @returns  {PolygonGraphics}   返回PolygonGraphics实例
   */
export function PolygonGraphics(options) {
    options = options || {}
    if (options && options.positions) {
        return new Cesium.PolygonGraphics({
            hierarchy: {
                positions: options.positions
            },
            material: options.material || Cesium.Color.RED.withAlpha(0.2),
            clampToGround: options.clampToGround || false
        })
    }
}