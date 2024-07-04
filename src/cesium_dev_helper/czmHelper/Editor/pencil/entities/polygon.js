
/**
* 创建面实体
* @function
* @param {object} options
* @param {Cartesian3} options.positions - 坐标数组
* @param {object} options.material - 配置线段材质
* @param {boolean} options.clampToGround - 是否贴地
* @param {boolean} options.clampToS3M - 是否贴s3m模型
* @param {Object} options.distanceDisplayCondition -可视距离
* @param {Object} options.scaleByDistance - 缩放
* @returns {PolygonGraphics} 返回PolygonGraphics实例
*/
export function PolygonEntity(options) {
    options = options || {}
    if (options) {
        let entity = this.createGraphics()
        entity.name = options.name || ''
        entity.polygon = this.PolygonGraphics(options)
        entity.clampToS3M = this._objHasOwnProperty(options, 'clampToS3M', false)
        entity.polygon.scaleByDistance = options.scaleByDistance || new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e6, 0.5)//缩放
        entity.polygon.distanceDisplayCondition = options.distanceDisplayCondition || new Cesium.DistanceDisplayCondition(0.0, 1.5e7)//可视距离

        return this._graphicsLayer.entities.add(entity)
    }
}
