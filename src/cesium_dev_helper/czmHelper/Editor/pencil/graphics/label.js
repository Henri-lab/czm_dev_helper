/**
  * 获取标签图形
  * @function
  * @param {object} options
  * @param {string} options.text - 标签文字
  * @param {string} options.font - 字体
  * @param {string} options.fillColor - 颜色
  * @param {string} options.style - 风格
  * @param {number} options.outlineWidth - 外边线宽度
  * @param {boolean} options.showBackground - 是否显示背景颜色
  * @param {object} options.backgroundColor - 背景颜色
  * @param {string} options.verticalOrigin - 垂直方向
  * @param {object} options.pixelOffset - 偏移
  * @returns {LabelGraphics} 返回LabelGraphics实例
  */
export function LabelGraphics(options) {
    options = options || {}
    if (options && options.text) {
        return new Cesium.LabelGraphics({
            // 文字标签
            text: options.text,
            font: options.font || '14px sans-serif',
            fillColor: options.fillColor || Cesium.Color.GOLD,
            style: options.style || Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: options.outlineWidth || 2,
            showBackground: options.showBackground || false,
            backgroundColor:
                options.backgroundColor || new Cesium.Color(0.165, 0.165, 0.165, 0.8),
            verticalOrigin:
                options.verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: options.pixelOffset || new Cesium.Cartesian2(0, -30)
            // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        })
    }
}
