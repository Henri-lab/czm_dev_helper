/**
  *获取点图形
  * @function
  * @param {object} options
  * @param {object} options.color - 点颜色
  * @param {number} options.pixelSize - 点大小
  * @param {number} options.outlineColor  - 边线颜色
  * @param {number} options.outlineWidth - 边线宽
  * @returns  {PointGraphics}  返回PointGraphics实例
  */
export function PointGraphics(options) {
    options = options || {}
    if (options) {
        return new Cesium.PointGraphics({
            color: options.color || Cesium.Color.GREEN,
            pixelSize: options.pixelSize || 5,
            outlineColor: options.outlineColor || Cesium.Color.WHITE,
            outlineWidth: options.outlineWidth || 1
        })
    }
}