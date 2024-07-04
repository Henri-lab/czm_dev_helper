/**
* 获取走廊图形
* @function
* @param {object} options
* @param {number} options.length - 走廊长度
* @param {number} options.width - 走廊宽度
* @param {Object} options.material - 材质
* @param {boolean} options.outline - 轮廓线显示
* @param {Object} options.outlineColor - 轮廓线颜色
* @returns {CorriderGraphics} 返回CorriderGraphics实例
*/
export function CorridorGraphics(options={}) {
    if (options) {
        return new Cesium.CorridorGraphics({
            positions: options.positions,
            width: options.width || 200000.0, // 走廊宽度（米）
            material: options.material || Cesium.Color.RED.withAlpha(0.5), // 走廊的颜色和透明度
            outline: options.outline || true, // 是否显示轮廓线
            outlineColor: options.outline || Cesium.Color.BLACK // 轮廓线颜色
        })
    }
}