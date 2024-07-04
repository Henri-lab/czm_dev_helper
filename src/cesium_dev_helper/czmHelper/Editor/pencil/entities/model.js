/**
  * 创建模型实体
  * @function
  * @param {object} options
  * @param {Cartesian3} options.position - 坐标数组
  * @param {string} options.m_url - 模型url
  * @param {string} options.url - 模型url
  * @param {number} options.m_scale - 缩放比例
  * @param {number} options.scale - 缩放比例
  * @returns {ModelGraphics} 返回ModelGraphics实例
  */
export function ModelEntity(options) {
    if (options && options.position) {
        let entity = this.createGraphics()
        entity.name = options.name || 'model_graphic'
        entity.position = options.position
        entity.model = this.ModelGraphics(options)
        return this._graphicsLayer.entities.add(entity)
    }
}