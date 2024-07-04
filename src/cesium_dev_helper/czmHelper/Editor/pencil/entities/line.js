/**
    * 创建线实体
    * @function
    * @param {object} options
    * @param {Cartesian3} options.positions - 坐标数组
    * @param {string} options.name - 图形名称
    * @param {string} options.oid - 原始id
    * @param {object} options.material - 配置线段材质
    * @param {number} options.width - 线宽
    * @param {boolean} options.clampToGround - 是否贴地
    * @param {Object} options.distanceDisplayCondition -可视距离
    * @param {Object} options.scaleByDistance - 缩放
    * @returns {PolylineGraphics} 返回PolylineGraphics实例
    */
export function LineEntity(options) {
    if (options && options.positions) {
        let entity = this.createGraphics()
        entity.name = options.name || ''
        entity.oid = options.oid || 'line'
        entity.position = options.positions
        entity.polyline = this.LineGraphics(options)
        entity.polyline.scaleByDistance = options.scaleByDistance || new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e6, 0.5)//缩放
        entity.polyline.distanceDisplayCondition = options.distanceDisplayCondition || new Cesium.DistanceDisplayCondition(0.0, 1.5e7)//可视距离
        return this._graphicsLayer.entities.add(entity)
    }
}
