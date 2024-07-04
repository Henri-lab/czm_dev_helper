// 未完成

import { gifLoader } from '../../Data';
//   /**
//   *  动态渐变墙
//   * @function
//   * @param {object} options
//   * @param {Cartesian3} options.positions - 坐标数组
//   * @param {number} options.alp - 透明比例 0~1
//   * @param {number} options.num - 渐变步长
//   * @param {number} options.speed - 速度 0~1
//   * @param {object} options.color - 颜色
//   * @param {string} options.img - 材质图片
//   * @returns {wall} 返回wall实例
//   */
//   DynamicShadeWallEntity(options) {
//     if (options && options.positions) {
//       let alp = options.alp || 1,
//         num = options.num || 20,
//         color = options.color || Cesium.Color.RED,
//         speed = options.speed || 0.003

//       let wallEntity = this.createGraphics()
//       wallEntity.wall = {
//         positions: options.positions,
//         material: new Cesium.ImageMaterialProperty({
//           image: options.img || "",
//           transparent: true,
//           color: new Cesium.CallbackProperty(function () {
//             if (num % 2 === 0) {
//               alp -= speed
//             } else {
//               alp += speed
//             }

//             if (alp <= 0.1) {
//               num++
//             } else if (alp >= 1) {
//               num++
//             }
//             return color.withAlpha(alp)
//           }, false)
//         })
//       }
//       return this._graphicsLayer.entities.add(wallEntity)
//     }
//   }

//   /**
//    * 旋转面
//    * @function
//    * @param {object} options
//    * @param {boolean} options.isRotated -  是否开启旋转
//    * @param {Cartesian3} options.positions - 坐标数组
//    * @param {Cartesian2} options.dimensions - 长宽高
//    * @param {string} options.image - 图片
//    * @returns {plane} 返回plane实例
//    */
//   RotatePlaneEntity(options) {
//     if (options && options.center && options.positions) {
//       let entity = this.createGraphics(),
//         index = 0,
//         positions = options.positions,
//         _position = positions[0],
//         _center = options.center,
//         _plane = new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0);// 默认的固定平面

//       entity.position = new Cesium.CallbackProperty(function () {
//         _position = positions[index];
//         index = (index + 1) % positions.length;//更新索引;   索引顺序:0,1,2,~len-1,0~len-1,...
//         return _position;
//       }, false);

//       if (options.isRotated/* 如果开启旋转 */) {
//         // 平面随着 _center 和 _position 的变化而实时更新
//         _plane =
//           new Cesium.CallbackProperty(function () {
//             // 计算法向量
//             let normal = Cesium.Cartesian3.normalize(
//               Cesium.Cartesian3.subtract(_center, _position, new Cesium.Cartesian3()), new Cesium.Cartesian3()
//             )
//             //  返回Plane对象
//             return Cesium.Plane.fromPointNormal(_position, normal)
//           }, false)
//       }

//       const planeOpt = {
//         plane: _plane,
//         dimensions: options.dimensions || new Cesium.Cartesian2(200.0, 150.0),
//         material: new Cesium.ImageMaterialProperty({
//           image: options.image
//         })
//       };
//       entity.plane = this.PlaneGraphics(planeOpt)

//       return this._graphicsLayer.entities.add(entity)
//     }
//   }


//   /**
//    * 视频面板
//    * @function
//    * @param {object} options
//    * @param {Cartesian3} options.position - 坐标数组
//    * @param {Cartesian2} options.dimensions - 长宽高
//    * @param {HTMLElement} options.videoElement - video绑定dom
//    * @param {Cartesian3} options.normal - 面板法向方向
//    * @returns {plane} 返回plane实例
//    */
//   VideoPlaneEntity(options) {
//     if (options && options.position) {
//       let entity = this.createGraphics()
//       entity.position = options.position
//       entity.plane = {
//         plane: new Cesium.Plane(
//           options.normal || Cesium.Cartesian3.UNIT_Y,
//           0.0
//         ),
//         dimensions: options.dimensions || new Cesium.Cartesian2(200.0, 150.0),
//         material: new Cesium.ImageMaterialProperty({
//           image: options.videoElement
//         })
//       }
//       return this._graphicsLayer.entities.add(entity)
//     }
//   }

//   /**
//    * GIF广告牌
//    * @function
//    * @param {object} options
//    * @param {Cartesian3} options.position - 坐标数组
//    * @param {Cartesian2} options.dimensions - 长宽高
//    * @param {string} options.url - 图片
//    * @param {Cartesian3} options.normal - 垂直方向
//    * @returns {billboard} 返回entity实例
//    */
//   GifBillboardEntity(options) {
//     if (options && options.position) {
//       let gif = [],
//         url = options.url,
//         slow = 6
//       const imageProperty = gifLoader(url, gif, slow, '')
//       return this._graphicsLayer.entities.add({
//         position: options.position,
//         billboard: {
//           verticalOrigin: Cesium.VerticalOrigin.BASELINE,
//           image: imageProperty,
//           scale: 0.2
//         }
//       })
//     }
//   }