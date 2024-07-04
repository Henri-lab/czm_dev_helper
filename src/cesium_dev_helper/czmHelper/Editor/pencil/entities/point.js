/**
 * 创建点实体集合
 * @function
 * @param {object} options
 * @param {Array} options.positions - 坐标数组
 * @param {string} options.name - 图形名称
 * @param {string} options.oid - 原始id
 * @param {boolean} options.material - 材质
 * @param {boolean} options.point - 标识是point图形
 * @see {@link  module:Graphics#getPointGraphics|getPointGraphics}
 * @param {object} options.billboard - 绘制billboard图形的参数
 * @see {@link module:Graphics#getBillboardGraphics|getBillboardGraphics} 
 * @param {object} options.label - 绘制label图形的参数
 * @see {@link module:Graphics#getLabelGraphics|getLabelGraphics}
 * @returns {Array} 返回实例数组
 */
export function PointEntities(options) {
    if (options && options.positions) {
        let points = []
        for (let i in options.positions) {
            let position = options.positions[i]
            let entity = this.createGraphics()
            entity.name = options.name || ''
            entity.oid = options.oid || 'point'
            entity.position = position
            if (options.point) entity.point = this.PointGraphics()
            if (options.billboard)
                entity.billboard = this.BillboardGraphics(options.billboard)
            if (options.label) entity.label = this.LabelGraphics(options.label)
            points.push(this._graphicsLayer.entities.add(entity))
        }
        return points
    }
}