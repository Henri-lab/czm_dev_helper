// 参考https://github.com/dengxiaoning/cesium_dev_kit
import SuperGif from 'libgif'
import DrawingManager from "../../Manager/DrawingManager";
import * as Cesium from 'cesium';

let Cesium = null
let dfSt = undefined

/**
 * 图形模块
 * 用于向地图加载各种实体对象
 * @class
 * @augments  module:Base
 * @param {object} params
 * @param {object} params.viewer - cesium 实例
 * @param {object} params.cesiumGlobal - cesium 全局对象
 * @param {Array} params.defaultStatic - 静态资源
 * @exports  Graphics
 */
class Graphics extends DrawingManager {
  constructor(viewer, cesiumGlobal, defaultStatic) {
    super(viewer);
    this.Cesium = cesiumGlobal
    this.dfSt = defaultStatic
    this._graphicsLayer = new Cesium.CustomDataSource('graphicsLayer')
    this.viewer && this.viewer.dataSources.add(this._graphicsLayer)
  }


  //创建一个实体
  createGraphics() {
    let entity = {
      Author: 'henriFox',
    }
    Object.defineProperty(entity, Auther, {
      value: 'henriFox',
      writable: false,    // 不可写
      configurable: false // 不可配置
    });

    return entity;
  }

  /**
    * 判断对象是否有某个属性
    * @private
    * @param {object} obj 对象
    * @param {string} field  属性字段
    * @param {string} defVal  默认返回
    * @returns {string}
    */
  _objHasOwnProperty(obj, field, defVal) {
    return obj.hasOwnProperty(field) ? obj.field : defVal
  }



  /**
   *获取点图形
   * @function
   * @param {object} options
   * @param {object} options.color - 点颜色
   * @param {number} options.pixelSize - 点大小
   * @param {number} options.outlineColor  - 边线颜色
   * @param {number} options.outlineWidth - 边线宽
   * @returns  {PointGraphics}  返回PointGraphics实例
   */
  PointGraphics(options) {
    options = options || {}
    if (options) {
      return new Cesium.PointGraphics({
        color: options.color || Cesium.Color.GREEN,
        pixelSize: options.pixelSize || 5,
        outlineColor: options.outlineColor || Cesium.Color.WHITE,
        outlineWidth: options.outlineWidth || 1
      })
    }
  }

  /**
   *获取线图形
   * @function
   * @param {object} options
   * @param {Cartesian3} options.positions - 绘制线图形的坐标数组
   * @param {object} options.material - 配置线段材质
   * @param {number} options.width - 线宽
   * @param {boolean} options.clampToGround - 是否贴地
   * @returns {PolylineGraphics}   返回PolylineGraphics实例
   */
  LineGraphics(options) {
    options = options || {}
    if (options && options.positions) {
      return new Cesium.PolylineGraphics({
        show: true,
        positions: options.positions,
        material: options.material || Cesium.Color.YELLOW,
        width: options.width || 1,
        clampToGround: this._objHasOwnProperty(options, 'clampToGround', false)
      })
    }
  }

  /**
   *获取面图形
   * @function
   * @param {object} options
   * @param {Cartesian3} options.positions - 绘制线图形的坐标数组
   * @param {object} options.material - 配置线段材质
   * @param {boolean} options.clampToGround - 是否贴地
   * @returns  {PolygonGraphics}   返回PolygonGraphics实例
   */
  PolygonGraphics(options) {
    options = options || {}
    if (options && options.positions) {
      return new Cesium.PolygonGraphics({
        hierarchy: {
          positions: options.positions
        },
        material: options.material || Cesium.Color.RED.withAlpha(0.2),
        clampToGround: options.clampToGround || false
      })
    }
  }

  /**
   *获取标签图形
   * @function
   * @param {object} options
   * @param {string} options.l_text - 标签文字
   * @param {string} options.l_font - 字体
   * @param {string} options.l_fillColor - 颜色
   * @param {string} options.l_style - 风格
   * @param {number} options.l_outlineWidth - 外边线宽度
   * @param {boolean} options.l_showBackground - 是否显示背景颜色
   * @param {object} options.l_backgroundColor - 背景颜色
   * @param {string} options.l_verticalOrigin - 垂直方向
   * @param {object} options.l_pixelOffset - 偏移
   * @returns  {LabelGraphics} 返回LabelGraphics实例
   */
  LabelGraphics(options) {
    options = options || {}
    if (options && options.l_text) {
      return new Cesium.LabelGraphics({
        //文字标签
        text: options.l_text,
        font: options.l_font || '14px sans-serif',
        fillColor: options.l_fillColor || Cesium.Color.GOLD,
        style: options.l_style || Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: options.l_outlineWidth || 2,
        showBackground: options.l_showBackground || false,
        backgroundColor:
          options.l_backgroundColor ||
          new Cesium.Color(0.165, 0.165, 0.165, 0.8),
        verticalOrigin:
          options.l_verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: options.l_pixelOffset || new Cesium.Cartesian2(0, -30)
        // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
      })
    }
  }
  /**
     *获取广告牌图形
     * @function
     * @param {object} options
     * @param {string} options.b_img - 背景图地址
     * @param {number} options.b_width - 宽度
     * @param {number} options.b_height - 高度
     * @param {boolean} options.b_clampToGround - 贴地
     * @param {number} options.b_scale - 缩放比例
     * @param {string} options.b_scaleByDistance - 缩放远近距离
     * @param {object} options.b_pixelOffset - 偏移
     * @returns {BillboardGraphics}   返回BillboardGraphics实例
     */
  BillboardGraphics(options) {
    options = options || {}
    if (options && options.b_img) {
      return new Cesium.BillboardGraphics({
        image: options.b_img,
        width: options.b_width || 35,
        height: options.b_height || 35,
        clampToGround: options.b_clampToGround || true,
        scale: options.b_scale || 1,
        // eyeOffset :new Cesium.Cartesian2(0, -20),
        pixelOffset: options.b_pixelOffset || new Cesium.Cartesian2(0, -20),
        scaleByDistance: options.b_scaleByDistance || undefined
        // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
      })
    }
  }
  /**
   * 获取路径
   * @function
   * @param {object} options
   * @param {number} options.resolution - 采样频率
   * @param {number} options.glowPower - 发光强度
   * @param {object} options.color - 颜色
   * @param {number} options.width - 宽度
   * @returns {PathGraphics}   返回PathGraphics实例
   */
  PathGraphics(options) {
    options = options || {}
    if (options) {
      return new Cesium.PathGraphics({
        resolution: options.resolution || 1,
        //设置航线样式，线条颜色，内发光粗细，航线宽度等
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: options.glowPower || 0.1,
          color: options.color || Cesium.Color.YELLOW
        }),
        width: options.width || 30
      })
    }
  }
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
  ModelGraphics(options) {
    options = options || {}
    if (options) {
      return new Cesium.ModelGraphics({
        uri: options.m_url || options.url,
        scale: options.m_scale || options.scale || 10,
        clampAnimations: true
      })
    }
  }
  /**
   * 获取椭圆
   * @function
   * @param {object} options
   * @param {number} options.e_semiMajorAxis - 长半轴
   * @param {number} options.e_semiMinorAxis - 短半轴
   * @param {object} options.e_metarial - 材质
   * @param {boolean} options.e_outline - 是否显示外边线
   * @returns {EllipseGraphics}   返回EllipseGraphics实例
   */
  EllipseGraphics(options) {
    options = options || {}
    if (options) {
      return new Cesium.EllipseGraphics({
        semiMajorAxis: options.e_semiMajorAxis || 1000000.0,
        semiMinorAxis: options.e_semiMinorAxis || 1000000.0,
        metarial: options.e_metarial || Cesium.Color.RED.withAlpha(0.5),
        outline: this._objHasOwnProperty(options, 'e_outline', true)
      })
    }
  }
  /**
   * 获取球
   * @function
   * @param {object} options
   * @param {number} options.radii - 半径
   * @param {number} options.innerRadii - 内球半径
   * @param {number} options.maximumCone - 椭圆最大角度
   * @param {number} options.stackPartitions - 垂直分段数
   * @param {number} options.slicePartitions - 平行分段数
   * @param {number} options.outlineWidth -外边线宽度
   * @param {object} options.outlineColor - 外边线颜色
   * @param {boolean} options.outline - 是否显示外边线
   * @param {boolean} options.fill - 是否填充
   * @param {boolean} options.material - 材质
   * @returns {EllipsoidGraphics}  返回EllipsoidGraphics实例
   */
  EllipsoidGraphics(options) {
    options = options || {}
    if (options) {
      let r = options.radii || 1000000.0 //默认100公里
      return new Cesium.EllipsoidGraphics({
        radii: new Cesium.Cartesian3(r, r, r), //单位 米
        innerRadii: this._objHasOwnProperty(
          options,
          'innerRadii',
          new Cesium.Cartesian3(r / 1.5, r / 1.5, r / 1.5)
        ),
        maximumCone: options.maximumCone || Cesium.Math.PI_OVER_TWO,
        stackPartitions: options.stackPartitions || 56,
        slicePartitions: options.slicePartitions || 56,
        outlineWidth: options.outlineWidth || 2.0,
        outlineColor: options.outlineColor || Cesium.Color.YELLOW,
        outline: this._objHasOwnProperty(options, 'outline', true),
        fill: this._objHasOwnProperty(options, 'fill', true),
        material: options.material || Cesium.Color.RED.withAlpha(0.1)
        //heightReference:Cesium.HeightReference.NONE,
      })
    }
  }




  /**
   * 获取盒子图形
   * @function
   * @param {object} options
   * @param {boolean} options.show - 是否显示
   * @param {object} options.dimensions - 盒子长宽高
   * @param {object} options.distanceDisplayCondition - 显示条件
   * @param {object} options.outlineColor - 外边线颜色
   * @param {boolean} options.outline - 是否显示外边线
   * @param {boolean} options.fill - 是否填充
   * @param {boolean} options.material - 材质
   * @returns {BoxGraphics} 返回BoxGraphics实例
   */
  BoxGraphics(options) {
    options = options || {}
    if (options) {
      return new Cesium.BoxGraphics({
        show: this._objHasOwnProperty(options, 'show', true),
        fill: this._objHasOwnProperty(options, 'fill', true),
        dimensions: options.dimensions || new Cesium.Cartesian3(0, 0, 0),
        material: options.material,
        outline: this._objHasOwnProperty(options, 'outline', true),
        outlineColor: options.outlineColor || Cesium.Color.BLACK,
        distanceDisplayCondition: options.distanceDisplayCondition || undefined
      })
    }
  }
  /**
   * 获取面板图形
   * @function
   * @param {object} options
   * @param {object} options.plane - 面板垂直方向
   * @param {object} options.dimensions - 面板长宽高
   * @param {boolean} options.material - 材质
   * @returns {PlaneGraphics} 返回PlaneGraphics实例
   */
  PlaneGraphics(options) {
    options = options || {}
    if (options) {
      return new Cesium.PlaneGraphics({
        plane: options.plane || new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0),
        dimensions: options.dimensions || new Cesium.Cartesian2(170.0, 130.0),
        material: options.material || Cesium.Color.BLUE
      })
    }
  }
  /**
   * 获取锥体图形
   * @function
   * @param {object} options
   * @param {number} options.length - 长度
   * @param {number} options.topRadius - 顶部半径
   * @param {number} options.bottomRadius - 底部半径
   * @param {boolean} options.material - 材质
   * @param {number} options.slices - 垂直分段数量
   * @returns {CylinderGraphics} 返回CylinderGraphics实例
   */
  CylinderGraphics(options) {
    options = options || {}
    if (options) {
      return new Cesium.CylinderGraphics({
        HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        length: options.length || 500 / 2,
        topRadius: options.topRadius || 0,
        bottomRadius: options.bottomRadius || 0,
        material: options.material || new Cesium.Color(0, 1, 1, 0.4),
        slices: options.slices || 128
      })
    }
  }


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
  PointEntities(options) {
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
     * @param {object} options.label - 绘制label图形的参数
     * @returns {PolylineGraphics} 返回PolylineGraphics实例
     */
  LineEntity(options) {
    if (options && options.positions) {
      let entity = this.createGraphics()
      entity.name = options.name || ''
      entity.oid = options.oid || 'line'
      entity.position = options.positions
      entity.polyline = this.LineGraphics(options)

      return this._graphicsLayer.entities.add(entity)
    }
  }

  /**
  * 创建面实体
  * @function
  * @param {object} options
  * @param {Cartesian3} options.positions - 坐标数组
  * @param {object} options.material - 配置线段材质
  * @param {boolean} options.clampToGround - 是否贴地
  * @param {boolean} options.clampToS3M - 是否贴s3m模型
  * @returns {PolygonGraphics} 返回PolygonGraphics实例
  */
  PolygonEntity(options) {
    options = options || {}
    if (options) {
      let entity = this.createGraphics()
      entity.name = options.name || ''
      entity.polygon = this.PolygonGraphics(options)
      entity.clampToS3M = this._objHasOwnProperty(options, 'clampToS3M', false)

      return this._graphicsLayer.entities.add(entity)
    }
  }

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
  BoxEntity(options) {
    options = options || {}
    if (options) {
      let entity = this.createGraphics()
      entity.position = options.position
      entity.name = options.name || 'box_graphic'
      entity.box = this.BoxGraphics(options.box)
      return this._graphicsLayer.entities.add(entity)
    }
  }

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
  ModelEntity(options) {
    if (options && options.position) {
      let entity = this.createGraphics()
      entity.name = options.name || 'model_graphic'
      entity.position = options.position
      entity.model = this.ModelGraphics(options)
      return this._graphicsLayer.entities.add(entity)
    }
  }









  /**
     * 创建地面指示实体
     * @function
     * @param {object} options
     * @param {Cartesian3} options.positions - 坐标数组
     * @param {number} options.height - 高度
     * @param {number} options.width - 宽度
     * @param {object} options.material - 材质
     * @param {boolean} options.outline - 是否显示外边线
     * @param {number} options.extrudedHeight - 拉伸高度
     * @param {string} options.cornerType - 转角类型
     * @returns {corridor} 返回corridor实例
     */
  CorridorEntity(options) {
    if (options && options.positions) {
      let { positions, height, width, material, ...rest } = options
      /** @inheritdoc */
      let entity = this.createGraphics()
      height = height === undefined ? 6.0 : height
      width = width === undefined ? 15.0 : width
      entity.corridor = {
        positions,
        height,
        width,
        ...rest,
        material:
          material ||
          new Cesium.Scene.WarnLinkMaterialProperty({
            freely: 'cross',
            color: Cesium.Color.YELLOW,
            duration: 1000,
            count: 1.0,
            direction: '+'
          })
      }

      return this._graphicsLayer.entities.add(entity)
    }
  }


  /**
    * 构建动态线实体
    * @function
    * @param {object} options
    * @param {Cartesian3} options.positions - 坐标数组 (时间)
    * @param {object} options.material - 材质
    * @param {number} options.width - 宽度
    * @param {boolean} options.clampToGround - 是否贴地
    * @returns {polyline} 返回polyline实例
    */
  DynamicPolyLineEntity(options) {
    if (options && options.positions) {
      let entity = this.createGraphics()
      entity.polyline = this.LineEntity(options)
      entity.polyline.positions = new Cesium.CallbackProperty(function () {
        return options.positions
      }, false)

      return this._graphicsLayer.entities.add(entity)
    }
  }


  /**
     * 构建动态椎体
     * @function
     * @param {object} options
     * @param {CylinderGraphics} options.cylinder - 椎体对象
     * @param {entity} options.entity - entity实体
     * @param {number} options.width - 宽度
     * @param {boolean} options.clampToGround - 是否贴地
     * @returns {cylinder} 返回cylinder实例
     */
  DynamicCylinderEntity(options) {
    let entity = this.createGraphics();
    if (options && options.cylinder) {
      let entity = options.entity
      let cylinder = options.cylinder
      let $this = this
      entity.cylinder = this.CylinderGraphics(cylinder)
      entity.position = new Cesium.CallbackProperty(function () {
        let positions = entity.position.getValue(
          $this.viewer.clock.currentTime
        )
        let cartographic = $this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
          positions
        )
        let lat = Cesium.Math.toDegrees(cartographic.latitude)
        let lng = Cesium.Math.toDegrees(cartographic.longitude)
        // hei = parseFloat(cartographic.height / 4)
        return Cesium.Cartesian3.fromDegrees(lng, lat, 0)
      }, false)

      entity.cylinder.length = new Cesium.CallbackProperty(function () {
        let positions = entity.position.getValue(
          $this.viewer.clock.currentTime
        )
        let cartographic = $this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
          positions
        )
        return cartographic.height * 2
      }, false)

      return this._graphicsLayer.entities.add(entity)
    }
  }
}