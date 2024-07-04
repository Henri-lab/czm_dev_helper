/**
   * 创建Box实体
   * @function
   * @param {object} options
   * @param {Cartesian3} options.position - 坐标数组
   * @param {boolean} options.show - 是否显示
   * @param {string} options.name - 名称
   * @param {object} options.dimensions - 盒子长宽高
   * @param {object} options.distanceDisplayCondition - 显示条件
   * @param {object} options.outlineColor - 外边线颜色
   * @param {boolean} options.outline - 是否显示外边线
   * @param {boolean} options.fill - 是否填充
   * @param {boolean} options.material - 材质
   * @returns {BoxGraphics} 返回BoxGraphics实例
   */
export function BoxEntity(options = {}) {
    if (options) {
        let entity = this.createGraphics()
        box = this.BoxGraphics(options)
        entity.name = options.name || 'box_graphic'
        entity.position = options.position
        entity.box = box
        return this._graphicsLayer.entities.add(entity)
    }
}