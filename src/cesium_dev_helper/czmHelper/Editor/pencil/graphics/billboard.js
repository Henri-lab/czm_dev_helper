/**
  *获取广告牌图形
  * @function
  * @param {object} options
  * @param {string} options.b_img - 背景图地址
  * @param {number} options.b_width - 宽度
  * @param {number} options.b_height - 高度
  * @param {boolean} options.b_clampToGround - 贴地
  * @param {number} options.b_scale - 缩放比例
  * @param {string} options.b_scaleByDistance - 缩放远近距离
  * @param {object} options.b_pixelOffset - 偏移
  * @returns {BillboardGraphics}   返回BillboardGraphics实例
  */
export function BillboardGraphics(options) {
    options = options || {}
    if (options && options.b_img) {
        return new Cesium.BillboardGraphics({
            image: options.b_img,
            width: options.b_width || 35,
            height: options.b_height || 35,
            clampToGround: options.b_clampToGround || true,
            scale: options.b_scale || 1,
            // eyeOffset :new Cesium.Cartesian2(0, -20),
            pixelOffset: options.b_pixelOffset || new Cesium.Cartesian2(0, -20),
            scaleByDistance: options.b_scaleByDistance || undefined
            // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
        })
    }
}