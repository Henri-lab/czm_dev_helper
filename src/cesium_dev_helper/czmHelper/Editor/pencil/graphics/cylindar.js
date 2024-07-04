/**
  * 获取锥体图形
  * @function
  * @param {object} options
  * @param {number} options.length - 长度
  * @param {number} options.topRadius - 顶部半径
  * @param {number} options.bottomRadius - 底部半径
  * @param {boolean} options.material - 材质
  * @param {number} options.slices - 垂直分段数量
  * @returns {CylinderGraphics} 返回CylinderGraphics实例
  */
export function CylinderGraphics(options) {
    if (options) {
        return new Cesium.CylinderGraphics({
            HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            length: options.length || 500 / 2,
            topRadius: options.topRadius || 0,
            bottomRadius: options.bottomRadius || 0,
            material: options.material || new Cesium.Color(0, 1, 1, 0.4),
            slices: options.slices || 128
        })
    }
}