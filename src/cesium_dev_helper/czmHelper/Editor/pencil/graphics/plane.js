/**
  * 获取面板图形
  * @function
  * @param {object} options
  * @param {Cartesian2} options.dimensions - 平面维度
  * @param {Object} options.plane - 平面
  * @param {Object} options.material - 材质
  * @param {boolean} options.outline - 轮廓线显示
  * @param {Object} options.outlineColor - 轮廓线颜色
  * @param {ShadowMode} options.shadows - 投影模式
  * @param {DistanceDisplayCondition} options.distanceDisplayCondition -可视距离 new Cesium.DistanceDisplayCondition(near, far).
  * @returns {CorriderGraphics} 返回CorriderGraphics实例
  */
export function PlaneGraphics(options) {
    options = options || {}
    if (options) {
        return new Cesium.PlaneGraphics({
            plane: options.plane || new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0), // PlaneGraphics 的一个属性是 Plane 
            dimensions: options.dimensions || new Cesium.Cartesian2(100.0, 100.0),
            material: options.material || Cesium.Color.RED.withAlpha(0.5), // 走廊的颜色和透明度
            outline: options.outline || true, // 是否显示轮廓线
            outlineColor: options.outline || Cesium.Color.BLACK, // 轮廓线颜色
            distanceDisplayCondition: options.distanceDisplayCondition || undefined,
            shadows: options.shadows || Cesium.ShadowMode.DISABLED // 投影模式
        })
    }
}