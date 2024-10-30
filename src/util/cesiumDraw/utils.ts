/*
 * @Author: Ming-tt m15075712681@163.com
 * @Date: 2024-03-11 14:55:17
 * @LastEditors: chenqiming chenqiming
 * @LastEditTime: 2024-09-20 10:04:38
 * @FilePath: \XD-285-QD-WEB\src\cesium\utils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as turf from '@turf/turf'
export default class utilsGroup {
  private Cesium = window.Cesium
  //测量的变量
  private pointData: any[] = [] //实体点
  private positions: any[] = [] //经纬度数组
  //当前的线的实体
  private polylines: any[] = []
  //存储的是所有的测量的线的实体
  private polylineData: any[] = []
  private areaPolygonArr: any[] = []
  private areaDistanceText: string = ''
  //测面积的变量
  constructor() {}
  //测量角度
  private angleData: any[] = [] //存储角度测量 产生的实体  用于后续删除
  //缓冲分析
  private bufferData: any[] = [] //存储缓冲分析产生的实体  用于后续删除
  //测量高度
  private entityCollection: any[] = [] //存储高度测量产生的实体  用于后续删除
  private handler: any = null

  private isTextShow: any = false // 文字显示隐藏
  //测距离
  public measureDistance(viewer: any) {
    let newDiv = this.createDiv(' 正在进行距离测量  左击开始    右击结束')
    // setTimeout(() => {
    //   document.body.removeChild(newDiv);
    // }, 3000);
    //绘制点位
    let addPoint = (value: any, text: string, text1: string) => {
      let poin = viewer.entities.add({
        id: Math.random(),
        position: value,
        point: {
          pixelSize: 5,
          color: new window.Cesium.Color(1, 0, 0, 1),
          clampToGround: true,
          // heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          // disableDepthTestDistance:9900
        },
        label: {
          text: `总长:${text}km  两点间距离${text1}km`,
          font: '18px sans-serif',
          backgroundColor: window.Cesium.Color.ORANGE,
          fillColor: window.Cesium.Color.WHITE,
          showBackground: true,
          style: window.Cesium.LabelStyle.FILL,
          outlineWidth: 1,
          horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
          pixelOffset: window.Cesium.Cartesian2(5.0, -20.0),
          clampToGround: true,
          // heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          // disableDepthTestDistance:99000
        },
      })
      return poin
    }
    //绘制线
    let addPolyline = (value: any) => {
      let polyline = viewer.entities.add({
        id: Math.random(),
        polyline: {
          positions: new window.Cesium.CallbackProperty(function () {
            return value
          }),
          width: 3,
          material: window.Cesium.Color.YELLOW,
          clampToGround: true,
        },
      })
      return polyline
    }
    //计算两个点位的距离
    let calculateDistance = (pointData: any) => {
      var distance = 0
      var s = 0

      for (let i = 0; i < pointData.length - 1; i++) {
        var point1cartographic = window.Cesium.Cartographic.fromCartesian(
          pointData[i]
        )
        var point2cartographic = window.Cesium.Cartographic.fromCartesian(
          pointData[i + 1]
        )
        let x1 = window.Cesium.Math.toDegrees(point1cartographic.longitude)
        let y1 = window.Cesium.Math.toDegrees(point1cartographic.latitude)
        let x2 = window.Cesium.Math.toDegrees(point2cartographic.longitude)
        let y2 = window.Cesium.Math.toDegrees(point2cartographic.latitude)
        // if (x1 !== x2 && y1 !== y2) {
        var from = turf.point([x1, y1])
        var to = turf.point([x2, y2])
        var options = { units: 'kilometers' }
        s = turf.distance(from, to, options).toFixed(4)
        distance = distance + Number(s)
        // return [distance.toFixed(2), Number(s)];
        // }
      }
      return [distance.toFixed(4), Number(s)]
    }
    //屏幕坐标转换为地形坐标
    let getCatesian3 = (coordinate: any) => {
      var cartesian
      var ray = viewer.camera.getPickRay(coordinate)
      if (!ray) return null
      cartesian = viewer.scene.globe.pick(ray, viewer.scene)
      return cartesian
    }

    //鼠标相关的事件
    let startCreate = () => {
      this.handler !== null ? this.handler.destroy() : ''
      let text: any = '起点'
      let text1: any = '0'
      this.handler = new window.Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      )
      let _this = this
      this.handler.setInputAction(function (event: any) {
        const { position } = event
        //屏幕坐标转化为笛卡尔坐标
        const ray = viewer.camera.getPickRay(position)
        const cartesian3 = viewer.scene.globe.pick(ray, viewer.scene)
        if (cartesian3 == undefined) return //如果点位不在球上就不执行以下操作
        var pickObj = viewer.scene.pick(event.position)
        // if (pickObj) {
        if (_this.polylines) {
          let distanceData = calculateDistance(_this.positions)
          text = distanceData[0]
          text1 = distanceData[1]
        }

        //屏幕坐标转换为地形坐标
        var cartesian = getCatesian3(position)
        let entity = addPoint(cartesian, text, text1)
        //保存点位实体到数组中  以便后续删除
        _this.pointData.push(entity)
        //保存坐标信息到数组中  为画线做准备
        _this.positions.push(cartesian)
        //判断 如果坐标数组中大于1 的时候 调用 画线方法
        if (_this.positions.length > 1 && _this.polylines.length == 0) {
          let line = addPolyline(_this.positions)
          _this.polylines.push(line)
        }
        // }
      }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this.handler.setInputAction(function (event: any) {
        let ray = that.viewer.camera.getPickRay(event.endPosition)
        let cartesians = that.viewer.scene.globe.pick(
          ray,
          that.viewer.scene
        )
        if (cartesians) {
          var cartesian = getCatesian3(event.endPosition)
          if (_this.positions.length > 0) {
            _this.positions.push(cartesian)
            if (_this.positions.length > 2) {
              _this.positions.pop()
            }
            if (_this.polylines) {
              _this.positions.pop()
              _this.positions.push(cartesian)
            }
          }
        }
      }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      this.handler.setInputAction(function (event: any) {
        // var cartesian = val.getCatesian3(event.position);
        //判断 点位实体 和positions 数量不一致时 删掉最后一个positions
        if (_this.pointData.length !== _this.positions.length) {
          _this.positions.pop()
        }

        //右击确定之后 删除 移动中产生的线段点位
        _this.polylines.forEach((item: any) => {
          viewer.entities.remove(item)
        })

        //对于现有的点位 进行重新绘制线段
        let line = addPolyline(_this.positions)
        _this.polylineData.push(line)

        _this.polylines = []
        _this.positions = []

        //右击 销毁 handler事件
        _this.handler.destroy()
        _this.handler = null
        document.body.removeChild(newDiv)
      }, window.Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
    startCreate()
  }
  //测面积
  public measureArea(viewer: any) {
    let newDiv = this.createDiv(' 正在进行面积测量  左击开始    右击结束')
    //绘制点位
    let createPoint = (PointData: any[]) => {
      let poin = viewer.entities.add({
        id: Math.random(),
        position: PointData,
        point: {
          pixelSize: 5,
          color: new window.Cesium.Color(1, 0, 0, 1),
          clampToGround: true,
          // heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          // disableDepthTestDistance:999999000
        },
      })
      return poin
    }

    //绘制面
    let createPolygon = (polygonData: any[]) => {
      let polygon = viewer.entities.add({
        id: Math.random(),
        position: polygonData[0],
        polygon: {
          hierarchy: new window.Cesium.CallbackProperty(function () {
            return new window.Cesium.PolygonHierarchy(polygonData)
          }),
          clampToGround: true,
          fill: true,
          material: new window.Cesium.Color.YELLOW.withAlpha(0.5),
          width: 3,
          // heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          // disableDepthTestDistance:999999000
        },
        label: {
          text: this.areaDistanceText,
          font: '18px sans-serif',
          backgroundColor: window.Cesium.Color.ORANGE,
          fillColor: window.Cesium.Color.WHITE,
          showBackground: true,
          style: window.Cesium.LabelStyle.FILL,
          outlineWidth: 1,
          horizontalOrigin: window.Cesium.HorizontalOrigin.LEFT,
          pixelOffset: window.Cesium.Cartesian2(5.0, -20.0),
          // clampToGround: true,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: 90000,
          // heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          // disableDepthTestDistance:999999000
        },
      })
      return polygon
    }
    //计算面积
    let calculateArea = (data: any[]) => {
      let areaData: any[] = []
      data.forEach((item) => {
        var position =
          window.Cesium.Ellipsoid.WGS84.cartesianToCartographic(item)
        areaData.push([
          window.Cesium.Math.toDegrees(position.latitude),
          window.Cesium.Math.toDegrees(position.longitude),
        ])
      })
      areaData.push([areaData[0][0], areaData[0][1]])
      console.log(areaData)
      var polygon = turf.polygon([areaData])
      var area = (turf.area(polygon) / 1000000).toFixed(6) + 'km²'
      return area
    }

    let startCreate = () => {
      this.handler !== null ? this.handler.destroy() : ''
      let _this = this
      let positions: any[] = []
      let pointData: any[] = []
      let polyline: any[] = []
      this.areaDistanceText = ''
      this.handler = new window.Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      )
      this.handler.setInputAction(function (event: any) {
        const { position } = event
        //屏幕坐标转化为笛卡尔坐标
        const ray = viewer.camera.getPickRay(position)
        const cartesian3 = viewer.scene.globe.pick(ray, viewer.scene)
        if (cartesian3 == undefined) return //如果点位不在球上就不执行以下操作
        // var pickObj = viewer.scene.pick(event.position);
        // if (pickObj) {
        if (pointData.length > 1) {
          _this.areaDistanceText = calculateArea(positions)
        }
        //屏幕坐标转换为地形坐标
        var cartesian = getCatesian3(position)
        let entity = createPoint(cartesian)
        //保存点位实体到数组中  以便后续删除
        pointData.push(entity)
        //保存坐标信息到数组中  为画线做准备
        positions.push(cartesian)
        //判断 如果坐标数组中大于1 的时候 调用 画线方法
        if (positions.length > 2 && polyline.length == 0) {
          let line = createPolygon(positions)
          polyline.push(line)
        }
        // }
      }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this.handler.setInputAction(function (event: any) {
        let ray = that.viewer.camera.getPickRay(event.endPosition)
        let cartesians = that.viewer.scene.globe.pick(
          ray,
          that.viewer.scene
        )
        // var pickObj = viewer.scene.pick(event.endPosition);
        if (cartesians) {
          var cartesian = getCatesian3(event.endPosition)
          if (positions.length > 0) {
            positions.push(cartesian)
            if (positions.length > 2) {
              positions.pop()
            }
            if (polyline) {
              positions.pop()
              positions.push(cartesian)
            }
          }
          if (pointData.length > 1) {
            _this.areaDistanceText = calculateArea(positions)
            polyline[0].label.text._value = _this.areaDistanceText
          }
        }
      }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      this.handler.setInputAction(function () {
        //判断如果点位小于3个 右击的时候就删除掉
        if (pointData.length < 3) {
          pointData.forEach((item) => {
            viewer.entities.remove(item)
          })
        }

        //判断 点位实体 和positions 数量不一致时 删掉最后一个positions
        if (pointData.length !== positions.length) {
          positions.pop()
        }

        //右击确定之后 删除 移动中产生的线段点位
        polyline.forEach((item) => {
          viewer.entities.remove(item)
        })

        if (pointData.length > 2) {
          _this.areaDistanceText = calculateArea(positions)
          // //对于现有的点位 进行重新绘制线段
          let line = createPolygon(positions)
          _this.areaPolygonArr.push(line)

          pointData.forEach((item) => {
            viewer.entities.remove(item)
          })
        }

        polyline = []
        positions = []
        pointData = []

        //右击清除点位信息
        // val.clearEntity(pointData);
        //右击 销毁 handler事件
        _this.handler.destroy()
        _this.handler = null
        // _this.isTextShow = true;
        document.body.removeChild(newDiv)
      }, window.Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
    //屏幕坐标转换为地形坐标
    let getCatesian3 = (coordinate: any) => {
      var cartesian
      var ray = viewer.camera.getPickRay(coordinate)
      if (!ray) return null
      cartesian = viewer.scene.globe.pick(ray, viewer.scene)
      return cartesian
    }
    startCreate()
  }
  //测角度
  public mesureTrangle(viewer: any) {
    let newDiv = this.createDiv(' 正在进行角度  左击开始    左击结束')
    // setTimeout(() => {
    //   document.body.removeChild(newDiv);
    // }, 3000);
    // this.angleData =[];
    this.handler !== null ? this.handler.destroy() : ''
    var line = undefined //全局线对象
    var linearr = [] //线的坐标存储
    var bearing = null //存储计算完后得角度
    var points = [] //点位
    var measureAngleArrs = [] //正北基准线坐标存储
    var texts = null //全局文字对象
    this.handler = new Cesium.ScreenSpaceEventHandler(
      that.viewer.scene.canvas
    )
    this.handler.setInputAction((movement) => {
      const { position } = movement
      //屏幕坐标转化为笛卡尔坐标
      const ray = viewer.camera.getPickRay(position)
      const cartesian3 = viewer.scene.globe.pick(ray, viewer.scene)
      if (cartesian3 == undefined) return //如果点位不在球上就不执行以下操作
      //笛卡尔坐标转经纬度
      const radians =
        viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3)
      const lat = Cesium.Math.toDegrees(radians.latitude) //弧度转度
      const lng = Cesium.Math.toDegrees(radians.longitude)
      if (cartesian3) {
        //添加一个线对象
        if (!line) {
          linearr.push(cartesian3)
          measureAngleArrs.push(Cesium.Cartesian3.fromDegrees(lng, lat, 10))
          points.push([lng, lat])
          line = viewer.entities.add({
            id: Math.random(),
            polyline: {
              positions: new Cesium.CallbackProperty(function () {
                return linearr
              }, false),
              width: 2,
              material: new Cesium.PolylineGlowMaterialProperty({
                color: Cesium.Color.RED,
              }),
              clampToGround: true,
            },
          })
          this.angleData.push(line)
        }
      }
      // handlers消除事件具柄
      if (linearr.length > 1) {
        this.handler.destroy()
        document.body.removeChild(newDiv)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.setInputAction((movement) => {
      const { endPosition } = movement
      //屏幕坐标转化为笛卡尔坐标
      const ray = viewer.camera.getPickRay(endPosition)
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
      if (cartesian == undefined) return //如果点位不在球上就不执行以下操作
      //笛卡尔坐标转经纬度
      const radians =
        viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
      const lat = Cesium.Math.toDegrees(radians.latitude) //弧度转度
      const lng = Cesium.Math.toDegrees(radians.longitude)
      if (line) {
        linearr[1] = cartesian
        points[1] = [lng, lat]
        //正北方向基准线
        if (measureAngleArrs.length == 1) {
          measureAngleArrs.push(
            Cesium.Cartesian3.fromDegrees(points[0][0], points[0][1] + 1.0, 10)
          )
          let directionLine = viewer.entities.add({
            id: Math.random(),
            polyline: {
              positions: measureAngleArrs,
              width: 4,
              material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.YELLOW,
              }),
              clampToGround: true,
            },
          })
          this.angleData.push(directionLine)
        }

        //计算角度  turf
        var point1 = turf.point([points[0][0], points[0][1]])
        var point2 = turf.point([points[1][0], points[1][1]])
        bearing = turf.bearing(point1, point2)
        //label  实体
        if (texts == null) {
          texts = viewer.entities.add({
            id: Math.random(),
            position: cartesian,
            label: {
              text: `角度${bearing.toFixed(4)}°`,
              font: '20px sans-serif',
              pixelOffset: new Cesium.Cartesian2(20.0, 20),
              fillColor: Cesium.Color.RED,
              clampToGround: true,
              // heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
              // disableDepthTestDistance:999999000
            },
          })
          this.angleData.push(texts)
        } else {
          texts.position = cartesian
          texts.label.text = `角度${bearing.toFixed(4)}°`
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
  //测高度
  public mesureHeight(viewer: any) {
    let newDiv = this.createDiv(' 正在进行高度测量  左击开始    左击结束')
    // setTimeout(() => {
    //   document.body.removeChild(newDiv);
    // }, 3000);
    this.handler !== null ? this.handler.destroy() : ''
    this.handler = new window.Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    )
    let _this = this

    /**
     * 添加标签
     * @param position
     * @param text
     */
    var addLabel = function (centerPoint, text) {
      return that.viewer.entities.add(
        new Cesium.Entity({
          id: Math.random(),
          position: centerPoint,
          label: {
            text: text,
            font: '12pt sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE, //FILL  FILL_AND_OUTLINE OUTLINE
            fillColor: Cesium.Color.YELLOW,
            showBackground: true, //指定标签后面背景的可见性
            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8), // 背景颜色
            backgroundPadding: new Cesium.Cartesian2(6, 6), //指定以像素为单位的水平和垂直背景填充padding
            pixelOffset: new Cesium.Cartesian2(0, -25),
          },
          clampToGround: true,
        })
      )
    }
    /**
     * 计算两点距离
     * @param firstPoint
     * @param secondPoint
     */
    var getLengthText = function (firstPoint, secondPoint) {
      // 计算距离
      var length = Cesium.Cartesian3.distance(firstPoint, secondPoint)
      length = (length / 1000).toFixed(4) + 'km'
      // if (length > 1000) {
      //   length = (length / 1000).toFixed(4) + "km";
      // } else {
      //   length = length.toFixed(4) + " m";
      // }
      return length
    }
    /**
     * 添加点
     * @param position
     */
    var addPoint = function (position) {
      _this.entityCollection.push(
        that.viewer.entities.add(
          new Cesium.Entity({
            id: Math.random(),
            position: position,
            point: {
              color: Cesium.Color.GREEN,
              pixelSize: 10,
              scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 2000, 0.0),
              translucencyByDistance: new Cesium.NearFarScalar(
                500,
                1.0,
                2000,
                0.0
              ),
            },
          })
        )
      )
    }

    /**
     * 添加线
     * @param positions
     */
    var addLine = function (positions) {
      var dynamicPositions = new Cesium.CallbackProperty(function () {
        return positions
      }, false)
      _this.entityCollection.push(
        that.viewer.entities.add(
          new Cesium.Entity({
            id: Math.random(),
            polyline: {
              positions: dynamicPositions,
              width: 4,
              clampToGround: true,
              material: Cesium.Color.RED,
            },
          })
        )
      )
    }

    var positions = []

    var labelEntity_1 = null // 标签实体
    var labelEntity_2 = null // 标签实体
    // var labelEntity_3 = null; // 标签实体

    this.handler.setInputAction(function (event) {
      // var pickObj = viewer.scene.pick(event.position);
      var cartesian = that.viewer.scene.globe.pick(
        that.viewer.camera.getPickRay(event.position),
        that.viewer.scene
      ) // 坐标
      // 存储第一个点
      if (positions.length == 0) {
        positions.push(cartesian.clone())
        addPoint(cartesian)

        // 注册鼠标移动事件
        _this.handler.setInputAction(function (moveEvent) {
          var movePosition = that.viewer.scene.globe.pick(
            that.viewer.camera.getPickRay(moveEvent.endPosition),
            that.viewer.scene
          ) // 鼠标移动的点
          if (positions.length >= 2) {
            positions.pop()
            positions.pop()
            positions.pop()

            var cartographic = Cesium.Cartographic.fromCartesian(movePosition)
            var height = Cesium.Cartographic.fromCartesian(positions[0]).height

            var verticalPoint = Cesium.Cartesian3.fromDegrees(
              Cesium.Math.toDegrees(cartographic.longitude),
              Cesium.Math.toDegrees(cartographic.latitude),
              height
            )
            positions.push(verticalPoint)
            positions.push(movePosition)
            positions.push(positions[0])

            // 绘制label
            if (labelEntity_1) {
              that.viewer.entities.remove(labelEntity_1)
              _this.entityCollection.splice(
                _this.entityCollection.indexOf(labelEntity_1),
                1
              )
              that.viewer.entities.remove(labelEntity_2)
              _this.entityCollection.splice(
                _this.entityCollection.indexOf(labelEntity_2),
                1
              )
              // that.viewer.entities.remove(labelEntity_3);
              // _this.entityCollection.splice(
              //   _this.entityCollection.indexOf(labelEntity_3),
              //   1
              // );
            }

            // 计算中点
            var centerPoint_1 = Cesium.Cartesian3.midpoint(
              positions[0],
              positions[1],
              new Cesium.Cartesian3()
            )
            // 计算距离
            var lengthText_1 =
              '水平距离：' + getLengthText(positions[0], positions[1])

            labelEntity_1 = addLabel(centerPoint_1, lengthText_1)
            _this.entityCollection.push(labelEntity_1)

            // 计算中点
            var centerPoint_2 = Cesium.Cartesian3.midpoint(
              positions[1],
              positions[2],
              new Cesium.Cartesian3()
            )
            // 计算距离
            var lengthText_2 =
              '垂直距离：' + getLengthText(positions[1], positions[2])

            labelEntity_2 = addLabel(centerPoint_2, lengthText_2)
            _this.entityCollection.push(labelEntity_2)

            // 计算中点
            var centerPoint_3 = Cesium.Cartesian3.midpoint(
              positions[2],
              positions[3],
              new Cesium.Cartesian3()
            )
            // 计算距离
            // var lengthText_3 =
            //   "直线距离：" + getLengthText(positions[2], positions[3]);

            // labelEntity_3 = addLabel(centerPoint_3, lengthText_3);
            // _this.entityCollection.push(labelEntity_3);
          } else {
            var verticalPoint = new Cesium.Cartesian3(
              movePosition.x,
              movePosition.y,
              positions[0].z
            )
            positions.push(verticalPoint)
            positions.push(movePosition)
            positions.push(positions[0])
            // 绘制线
            addLine(positions)
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      } else {
        // 存储第二个点
        positions.pop()
        positions.pop()
        positions.pop()
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        var height = Cesium.Cartographic.fromCartesian(positions[0]).height

        var verticalPoint = Cesium.Cartesian3.fromDegrees(
          Cesium.Math.toDegrees(cartographic.longitude),
          Cesium.Math.toDegrees(cartographic.latitude),
          height
        )
        positions.push(verticalPoint)
        positions.push(cartesian)
        positions.push(positions[0])
        addPoint(cartesian)
        // that.viewer.screenSpaceEventHandler.removeInputAction(
        //   Cesium.ScreenSpaceEventType.LEFT_CLICK
        // );
        // that.viewer.screenSpaceEventHandler.removeInputAction(
        //   Cesium.ScreenSpaceEventType.MOUSE_MOVE
        // );
        _this.handler.destroy()
        document.body.removeChild(newDiv)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  //等高线分析
  public contourAnalysis(viewer: any) {
    //开启深度测试
    // viewer.scene.globe.enableLighting = true;
    var minHeight = -414.0 // 最小高度-例：最低接近死海高度
    var maxHeight = 8777.0 // 最大高度-例：最高接近珠峰高度
    var contourColor = Cesium.Color.RED.withAlpha(0.4) // 等高线的颜色
    var contourSpacing = 200.0 // 等高线的等间距
    var contourWidth = 1.0 // 等高线的宽度
    var material = Cesium.Material.fromType('ElevationContour')
    var contourUniforms = material.uniforms
    contourUniforms.width = contourWidth
    contourUniforms.spacing = contourSpacing
    contourUniforms.color = contourColor
    viewer.scene.globe.material = material
    var material = Cesium.Material.fromType('ElevationRamp')
    var shadingUniforms = material.uniforms
    shadingUniforms.minimumHeight = minHeight
    shadingUniforms.maximumHeight = maxHeight
    // shadingUniforms.image = getColorRamp(); // 彩色色带
  }
  //缓冲分析
  public bufferAnalysis(viewer: any) {
    let newDiv = this.createDiv(' 正在进行缓冲分析  左击开始    右击结束')
    // setTimeout(() => {
    //   document.body.removeChild(newDiv);
    // }, 3000);
    this.handler !== null ? this.handler.destroy() : ''
    this.handler = new Cesium.ScreenSpaceEventHandler(
      that.viewer.scene.canvas
    )
    let westSouthEastNorth = [] //矩形的四个点位坐标
    this.handler.setInputAction((movement) => {
      const { position } = movement
      //屏幕坐标转化为笛卡尔坐标
      const ray = viewer.camera.getPickRay(position)
      const cartesian3 = viewer.scene.globe.pick(ray, viewer.scene)
      if (cartesian3 == undefined) return //如果点位不在球上就不执行以下操作
      //笛卡尔坐标转经纬度
      const radians =
        viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3)
      const lat = Cesium.Math.toDegrees(radians.latitude) //弧度转度
      const lng = Cesium.Math.toDegrees(radians.longitude)
      westSouthEastNorth = [lng, lat]
      if (westSouthEastNorth) {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      }
      //矩形
      let rectangle = that.viewer.entities.add({
        id: Math.random(),
        position: window.Cesium.Cartesian3.fromDegrees(lng, lat),
        polygon: {
          hierarchy: new Cesium.CallbackProperty(function () {
            return {
              positions: Cesium.Cartesian3.fromDegreesArray(westSouthEastNorth),
            }
          }, false),
          material: Cesium.Color.YELLOW.withAlpha(0.6),
          classificationType: Cesium.ClassificationType.BOTH,
        },
        polyline: {
          positions: new Cesium.CallbackProperty(function () {
            return Cesium.Cartesian3.fromDegreesArray(westSouthEastNorth)
          }, false),
          width: 2,
          clampToGround: true,
          material: Cesium.Color.YELLOW.withAlpha(0.4),
        },
      })
      this.bufferData.push(rectangle)
      this.handler.setInputAction((move) => {
        let cartesian = that.viewer.camera.pickEllipsoid(
          move.endPosition,
          that.viewer.scene.globe.ellipsoid
        )
        let cartographic = Cesium.Cartographic.fromCartesian(
          cartesian,
          that.viewer.scene.globe.ellipsoid,
          new Cesium.Cartographic()
        )
        let lng1 = Cesium.Math.toDegrees(cartographic.longitude)
        let lat1 = Cesium.Math.toDegrees(cartographic.latitude)
        westSouthEastNorth = [
          lng,
          lat,
          lng,
          lat1,
          lng1,
          lat1,
          lng1,
          lat,
          lng,
          lat,
        ]
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      this.handler.setInputAction((move) => {
        this.handler.destroy()
        let result = []

        for (let i = 0; i < westSouthEastNorth.length; i += 2) {
          result.push(westSouthEastNorth.map(Number).slice(i, i + 2))
        }
        let degreesArray = this.pointsToDegreesArray(result)
        let polygonF = turf.polygon([result])
        let buffered = turf.buffer(polygonF, 6000, { units: 'meters' })
        let coordinates = buffered.geometry.coordinates
        result = coordinates[0]
        degreesArray = this.pointsToDegreesArray(result)
        // this.addBufferPolyogn(
        //   Cesium.Cartesian3.fromDegreesArray(degreesArray)
        // );
        let bufferMain = that.viewer.entities.add({
          id: Math.random(),
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(
              Cesium.Cartesian3.fromDegreesArray(degreesArray)
            ),
            material: Cesium.Color.RED.withAlpha(0.6),
            classificationType: Cesium.ClassificationType.BOTH,
          },
        })
        this.bufferData.push(bufferMain)
        document.body.removeChild(newDiv)
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  //格式转换
  public pointsToDegreesArray(points) {
    let degreesArray = []
    points.map((item) => {
      degreesArray.push(item[0])
      degreesArray.push(item[1])
    })
    return degreesArray
  }
  //二三维切换
  public DimensionCheck(viewer: any) {
    if (viewer.scene.mode == 3) {
      viewer.scene.mode = this.Cesium.SceneMode.SCENE2D
    } else {
      viewer.scene.mode = this.Cesium.SceneMode.SCENE3D
    }
  }
  //复位
  public restoration(viewer: any) {
    viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(115, 39, 30000000),
    })
  }
  //清除测距离
  public clearDistance(viewer: any) {
    //清除 测量
    if (!this.pointData.length) return
    this.pointData.forEach((item: any) => {
      viewer.entities.remove(item)
    })

    this.polylineData.forEach((item: any) => {
      viewer.entities.remove(item)
    })
  }
  //清除侧面积
  public clearArea(viewer: any) {
    //清除测面积
    if (!this.areaPolygonArr.length) return
    this.areaPolygonArr.forEach((item: any) => {
      viewer.entities.remove(item)
    })
  }
  //清除测量高度
  public clearHeight(viewer: any) {
    //清除高度
    if (!this.entityCollection.length) return
    this.entityCollection.forEach((item) => {
      viewer.entities.remove(item)
    })
  }
  //清除测量角度
  public clearAngle(viewer: any) {
    //清除角度测量
    if (!this.angleData.length) return
    this.angleData.forEach((item) => {
      viewer.entities.remove(item)
    })
  }
  //清除 缓冲分析
  public clearBuffer(viewer: any) {
    if (!this.bufferData.length) return
    this.bufferData.forEach((item) => {
      viewer.entities.remove(item)
    })
  }
  //清除 等高线分析
  public clearAnalysis(viewer: any) {
    // viewer.scene.globe.enableLighting = false;
    viewer.scene.globe.material = null
  }
  public createDiv(text) {
    let elements = document.querySelectorAll('.newDiv')
    if (elements.length !== 0) {
      document.body.removeChild(elements[0])
      let newDiv = document.createElement('div')
      newDiv.innerHTML = text
      newDiv.className = 'newDiv'
      document.body.appendChild(newDiv)
      return newDiv
    } else {
      let newDiv = document.createElement('div')
      newDiv.innerHTML = text
      newDiv.className = 'newDiv'
      document.body.appendChild(newDiv)
      return newDiv
    }
  }
  //清除
  public clearAll(viewer: any) {
    this.clearArea(viewer)
    this.clearHeight(viewer)
    this.clearAngle(viewer)
    this.clearDistance(viewer)
    this.clearAnalysis(viewer)
    this.clearBuffer(viewer)
  }
}
