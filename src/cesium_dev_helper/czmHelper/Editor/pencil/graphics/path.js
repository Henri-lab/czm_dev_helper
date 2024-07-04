/**
   * 获取路径
   * @function
   * @param {object} options
   * @param {number} options.resolution - 采样频率
   * @param {number} options.glowPower - 发光强度
   * @param {object} options.color - 颜色
   * @param {number} options.width - 宽度
   * @returns {PathGraphics}   返回PathGraphics实例
   */
export function PathGraphics(options) {
    options = options || {}
    if (options) {
        return new Cesium.PathGraphics({
            resolution: options.resolution || 1,
            //设置航线样式，线条颜色，内发光粗细，航线宽度等
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: options.glowPower || 0.1,
                color: options.color || Cesium.Color.YELLOW
            }),
            width: options.width || 30
        })
    }
}
