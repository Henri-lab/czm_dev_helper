/**
  * 获取模型
  * @function
  * @param {object} options
  * @param {string} options.m_url - 模型url
  * @param {string} options.url - 模型url
  * @param {number} options.m_scale - 缩放比例
  * @param {number} options.scale - 缩放比例
  * @returns {ModelGraphics}   返回ModelGraphics实例
  */
export function ModelGraphics(options) {
    options = options || {}
    if (options) {
        return new Cesium.ModelGraphics({
            uri: options.m_url || options.url,
            scale: options.m_scale || options.scale || 10,
            clampAnimations: true
        })
    }
}
