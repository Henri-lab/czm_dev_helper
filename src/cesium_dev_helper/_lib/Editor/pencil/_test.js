// function DynamicCylinderEntity(options) {
//     let entity = this.createGraphics();
//     if (options && options.cylinder) {
//         let entity = options.entity
//         let cylinder = options.cylinder
//         let $this = this
//         entity.name = options.name || ''
//         entity.cylinder = this.CylinderGraphics(cylinder)
//         entity.position = new Cesium.CallbackProperty(function () {
//             let positions = entity.position.getValue(
//                 $this.viewer.clock.currentTime
//             )
//             let cartographic = $this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
//                 positions
//             )
//             let lat = Cesium.Math.toDegrees(cartographic.latitude)
//             let lng = Cesium.Math.toDegrees(cartographic.longitude)
//             // hei = parseFloat(cartographic.height / 4)
//             return Cesium.Cartesian3.fromDegrees(lng, lat, 0)
//         }, false)

//         entity.cylinder.length = new Cesium.CallbackProperty(function () {
//             let positions = entity.position.getValue(
//                 $this.viewer.clock.currentTime
//             )
//             let cartographic = $this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
//                 positions
//             )
//             return cartographic.height * 2
//         }, false)

//         return this._graphicsLayer.entities.add(entity)
//     }
// }


// /**
//  * 创建渐变锥体
//  * @function
//  * @param {object} options
//  * @param {Cartesian3} options.position - 坐标数组
//  * @param {string} options.color - 颜色
//  * @param {number} options.duration - 持续时长
//  * @param {number} options.length - 长度
//  * @param {number} options.topRadius - 顶部半径
//  * @param {number} options.bottomRadius - 底部半径
//  * @param {number} options.slices - 垂直分段数量
//  * @returns {cylinder} 返回cylinder实例
//  */
// function FadeCylinderEntity(options) {
//     options = options || {}
//     if (options && options.position) {
//         let entity = this.createGraphics()
//         entity.name = options.name || ''
//         entity.position = options.position
//         options.material = new Cesium.Scene.CircleFadeMaterialProperty({
//             color: options.color || Cesium.Color.fromCssColorString('#02ff00'),
//             duration: options.duration || 2000
//         })
//         entity.cylinder = this.CylinderGraphics(options)

//         return this._graphicsLayer.entities.add(entity)
//     }
// }


