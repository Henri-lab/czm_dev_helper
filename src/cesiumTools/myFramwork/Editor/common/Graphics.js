import { CoordTransformer } from '../../Compute';
import { gifLoader } from '../../Data';
import { DrawingManager } from "../../Manager"
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
 * @param {Array} params.dataSource - 想要添加实体的图层
 * @param {Array} params.defaultStatic - 静态资源
 * @exports  Graphics
 */
export default class Graphics extends DrawingManager {
  constructor(viewer, cesiumGlobal, dataSource, defaultStatic) {
    super(viewer);
    this.Cesium = cesiumGlobal
    this.dfSt = defaultStatic
    this._graphicsLayer = dataSource || new Cesium.CustomDataSource('graphicsLayer')
    this.viewer && this.viewer.dataSources.add(this._graphicsLayer)
  }

  // 公共方法--------------------------------------------------------
  /**
    * 获取指定名称的静态资源的URL数组
    * @param {string[]} nameArray - 名称数组
    * @returns {string[]} - 静态资源的URL数组
    */
  getDfSt(nameArray) {
    let imgUrls = [];
    nameArray.forEach(name => {
      // If the dfSt object exists and contains the specified name,
      // push the corresponding URL to the imgUrls array.
      if (this.dfSt && this.dfSt[name]) {
        imgUrls.push(this.dfSt[name]);
      } else {
        // If the dfSt object does not exist or does not contain the specified name,
        // push the default image URL to the imgUrls array.
        imgUrls.push(this.defaultImageUrl);
      }
    });
    // Return the array of URLs.
    return imgUrls;
  }





  //  生成图形------------------------------------------------------------------------
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
   * @param {number} options.semiMajorAxis - 长半轴
   * @param {number} options.semiMinorAxis - 短半轴
   * @param {object} options.metarial - 材质
   * @param {boolean} options.outline - 是否显示外边线
   * @param {Object} options.outlineColor - 轮廓线颜色
   * @param {boolean} options.height - 高度
   * @returns {EllipseGraphics}   返回EllipseGraphics实例
   */
  EllipseGraphics(options) {
    options = options || {}
    if (options) {
      return new Cesium.EllipseGraphics({
        semiMajorAxis: options.semiMajorAxis || 1000000.0,
        semiMinorAxis: options.semiMinorAxis || 1000000.0,
        outlineColor: this._objHasOwnProperty(
          options,
          'outlineColor',
          Cesium.Color.RED
        ),
        height: options.height || 10,
        metarial: options.metarial || Cesium.Color.RED.withAlpha(0.5),
        outline: this._objHasOwnProperty(options, 'outline', true)
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
  * 获取走廊图形
  * @function
  * @param {object} options
  * @param {number} options.length - 走廊长度
  * @param {number} options.width - 走廊宽度
  * @param {Object} options.material - 材质
  * @param {boolean} options.outline - 轮廓线显示
  * @param {Object} options.outlineColor - 轮廓线颜色
  * @returns {CorriderGraphics} 返回CorriderGraphics实例
  */
  CorridorGraphics(options) {
    options = options || {}
    if (options) {
      return new Cesium.CorridorGraphics({
        positions: options.positions,
        width: options.width || 200000.0, // 走廊宽度（米）
        material: options.material || Cesium.Color.RED.withAlpha(0.5), // 走廊的颜色和透明度
        outline: options.outline || true, // 是否显示轮廓线
        outlineColor: options.outline || Cesium.Color.BLACK // 轮廓线颜色
      })
    }
  }

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
  PlaneGraphics(options) {
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


  // 创建实体--------------------------------------------------------
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
      entity.name = options.name || 'box_graphic'
      entity.position = options.position
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
      let entity = this.createGraphics();

      const properties = [
        { key: 'height', defaultValue: 10 },
        { key: 'width', defaultValue: 10 },
        { key: 'extrudedHeight', defaultValue: 10 },
        { key: 'cornerType', defaultValue: 'round' },
        {
          key: 'material', defaultValue: new Cesium.Scene.WarnLinkMaterialProperty({
            freely: 'cross',
            color: Cesium.Color.YELLOW,
            duration: 1000,
            count: 1.0,
            direction: '+'
          })
        }
      ];
      this._setProperties(options, properties);


      entity.corridor = this.CorridorGraphics(options);

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
      entity.name = options.name || ''
      entity.polyline = this.LineEntity(options)
      entity.polyline.positions = new Cesium.CallbackProperty(function () {
        return options.positions
      }, false)

      return this._graphicsLayer.entities.add(entity)
    }
  }

  /**
   * Creates a dynamic polygon entity that updates based on provided positions.
   *
   * @param {Object} options - The options for creating the polygon entity.
   * @param {Array<Cesium.Cartesian3>} options.positions - An array of Cartesian3 positions that define the polygon.
   * @param {string} [options.name] - The name of the polygon entity.
   * @param {Cesium.Material} [options.material] - The material to be used for the polygon.
   * @param {boolean} [options.clampToGround] - Whether the polygon should be clamped to the ground.
   * @returns {Cesium.Entity} The created polygon entity.
   */
  DynamicPolygonEntity(options) {
    if (options && options.positions) {
      let entity = this.createGraphics();
      entity.name = options.name || '';

      entity.polygon = {
        hierarchy: new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(options.positions);
        }, false),
        material: options.material || Cesium.Color.BLUE.withAlpha(0.8),
        clampToGround: options.clampToGround || true,
        extrudedHeight: options.extrudedHeight || undefined
      };

      return this._graphicsLayer.entities.add(entity);
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
      entity.name = options.name || ''
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

  /**
  * 创建渐变锥体
  * @function
  * @param {object} options
  * @param {Cartesian3} options.position - 坐标数组
  * @param {string} options.color - 颜色
  * @param {number} options.duration - 持续时长
  * @param {number} options.length - 长度
  * @param {number} options.topRadius - 顶部半径
  * @param {number} options.bottomRadius - 底部半径
  * @param {number} options.slices - 垂直分段数量
  * @returns {cylinder} 返回cylinder实例
  */
  FadeCylinderEntity(options) {
    options = options || {}
    if (options && options.position) {
      let entity = this.createGraphics()
      entity.name = options.name || ''
      entity.position = options.position
      options.material = new Cesium.Scene.CircleFadeMaterialProperty({
        color: options.color || Cesium.Color.fromCssColorString('#02ff00'),
        duration: options.duration || 2000
      })
      entity.cylinder = this.CylinderGraphics(options)

      return this._graphicsLayer.entities.add(entity)
    }
  }

  /**
  *  创建旋转圆柱
  * @function
  * @param {object} options
  * @param {Cartesian3} options.position - 坐标数组
  * @param {number} options.length - 长度
  * @param {number} options.topRadius - 顶部半径
  * @param {number} options.bottomRadius - 底部半径
  * @param {number} options.slices - 垂直分段数量
  * @param {string} options.img - 材质图片
  * @param {object} options.material - 材质(与图片二选一)
  * @returns {cylinder} 返回cylinder实例
  */
  RotateCylinderEntity(options) {
    if (options && options.position) {
      let entity = this.createGraphics()
      entity.name = options.name || ''
      options.material = options.material ||
        new Cesium.ImageMaterialProperty({
          image: options.img || '',//后续更新：可以加载默认的静态资源
          transparent: true,
          repeat: {
            x: 1,
            y: -1
          }
        })
      entity.cylinder = this.CylinderGraphics(options)
      entity.position = options.position

      this.setGraphicsRotate({
        entity,
        position: this.transformCartesianToWGS84(options.position),
        rotateAmount: 4
      })
      return this._graphicsLayer.entities.add(entity)
    }
  }

  /**
  *  创建闪烁圆
  * @function
  * @param {object} options
  * @param {Cartesian3} options.position - 坐标数组
  * @param {number} options.alp - 频率
  * @param {boolean} options.flog - 显示雾气效果
  * @param {number} options.height - 高度
  * @param {number} options.semiMinorAxis - 短半轴
  * @param {number} options.semiMajorAxis - 长半轴
  * @returns {ellipse} 返回ellipse实例
  */
  DynamicBlinkCircleEntity(options) {
    if (options && options.position) {
      let entity = this.createGraphics(),
        alp = options.alp || 1,
        flog = this._objHasOwnProperty(options, 'flog', true)
      entity.position = options.position
      options.material = options.material || new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(function () {
          if (flog) {
            alp = alp - 0.05
            if (alp <= 0) {
              flog = false // hide
            }
          } else {
            alp = alp + 0.05
            if (alp >= 1) {
              flog = true // show
            }
          }
          return Cesium.Color.RED.withAlpha(alp)
        }, false)
      )
      let ellipse = this.EllipseGraphics(options)

      entity.ellipse = ellipse
      return this._graphicsLayer.entities.add(entity)
    }
  }

  /**
  *  创建动态旋转圆
  * @function
  * @param {object} options
  * @param {object} options.center - 中心坐标数组
  * @param {number} options.radius - 半径
  * @param {number} options.rotateAmount - 旋转频率
  * @param {number} options.height - 高度
  * @param {number} options.scale - 外圆缩放比例
  * @param {number} options.scale2 - 内圆缩放比例
  * @param {string} options.imge - 材质图片
  * @param {object} options.material - 材质(与图片二选一)
  * @returns {ellipse} 返回ellipse实例
  */
  DynamicCricleEntity(options) {
    if (options && options.center) {
      let entity = this.createGraphics(),
        $this = this

      //生成动态实体配置选项
      let dynamicOpt = {},
        heading = 0,
        pitch = 0,
        roll = 0,
        _center = options.center,
        _radius = options.radius || 800,
        _rotateAmount = options.rotateAmount || 0.05,
        _stRotation = 0,
        _height = options.height || 1,
        _scale = options.scale || null,
        _scale2 = options.scale2 || null,
        _material =
          options.material ||
          new Cesium.ImageMaterialProperty({
            image: options.imge || "",
            transparent: true
          })

      let bg_scale = _radius
      let flag = false
      let updateScalerAxis = () => {
        if (_radius >= _scale || _radius <= bg_scale) {
          flag = !flag
        }
        flag ? (_radius += 2) : (_radius -= 2)
      }
      let updateScalerAxis2 = () => {
        _scale2 >= _radius ? (_radius += 2) : (_radius = bg_scale)
      }

      dynamicOpt = {
        material: _material,
        height: _height,
        semiMajorAxis: new Cesium.CallbackProperty(function () {
          return _radius
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function () {
          return _radius
        }, false),
        stRotation: new Cesium.CallbackProperty(function () {
          if (_rotateAmount > 0) {
            _stRotation += _rotateAmount
            if (_stRotation >= 360) {
              _stRotation = 0
            }
          }
          if (_scale) updateScalerAxis()
          if (_scale2) updateScalerAxis2()
          return _stRotation
        }, false)
      }

      entity.position = new Cesium.CallbackProperty(function () {
        return $this.transformWGS84ToCartesian(_center)
      }, false);

      entity.orientation = new Cesium.CallbackProperty(function () {
        return Cesium.Transforms.headingPitchRollQuaternion(
          $this.transformWGS84ToCartesian(_center),
          new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(heading),
            Cesium.Math.toRadians(pitch),
            Cesium.Math.toRadians(roll)
          )
        )
      }, false);

      entity.ellipse = this.EllipseGraphics(dynamicOpt);

      return this._graphicsLayer.entities.add(entity)
    }
  }

  /**
  *  动态渐变墙
  * @function
  * @param {object} options
  * @param {Cartesian3} options.positions - 坐标数组
  * @param {number} options.alp - 透明比例 0~1
  * @param {number} options.num - 渐变步长
  * @param {number} options.speed - 速度 0~1
  * @param {object} options.color - 颜色
  * @param {string} options.img - 材质图片
  * @returns {wall} 返回wall实例
  */
  DynamicShadeWallEntity(options) {
    if (options && options.positions) {
      let alp = options.alp || 1,
        num = options.num || 20,
        color = options.color || Cesium.Color.RED,
        speed = options.speed || 0.003

      let wallEntity = this.createGraphics()
      wallEntity.wall = {
        positions: options.positions,
        material: new Cesium.ImageMaterialProperty({
          image: options.img || "",
          transparent: true,
          color: new Cesium.CallbackProperty(function () {
            if (num % 2 === 0) {
              alp -= speed
            } else {
              alp += speed
            }

            if (alp <= 0.1) {
              num++
            } else if (alp >= 1) {
              num++
            }
            return color.withAlpha(alp)
          }, false)
        })
      }
      return this._graphicsLayer.entities.add(wallEntity)
    }
  }

  /**
   * 旋转面
   * @function
   * @param {object} options
   * @param {boolean} options.isRotated -  是否开启旋转
   * @param {Cartesian3} options.positions - 坐标数组
   * @param {Cartesian2} options.dimensions - 长宽高
   * @param {string} options.image - 图片
   * @returns {plane} 返回plane实例
   */
  RotatePlaneEntity(options) {
    if (options && options.center && options.positions) {
      let entity = this.createGraphics(),
        index = 0,
        positions = options.positions,
        _position = positions[0],
        _center = options.center,
        _plane = new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0);// 默认的固定平面

      entity.position = new Cesium.CallbackProperty(function () {
        _position = positions[index];
        index = (index + 1) % positions.length;//更新索引;   索引顺序:0,1,2,~len-1,0~len-1,...
        return _position;
      }, false);

      if (options.isRotated/* 如果开启旋转 */) {
        // 平面随着 _center 和 _position 的变化而实时更新
        _plane =
          new Cesium.CallbackProperty(function () {
            // 计算法向量
            let normal = Cesium.Cartesian3.normalize(
              Cesium.Cartesian3.subtract(_center, _position, new Cesium.Cartesian3()), new Cesium.Cartesian3()
            )
            //  返回Plane对象
            return Cesium.Plane.fromPointNormal(_position, normal)
          }, false)
      }

      const planeOpt = {
        plane: _plane,
        dimensions: options.dimensions || new Cesium.Cartesian2(200.0, 150.0),
        material: new Cesium.ImageMaterialProperty({
          image: options.image
        })
      };
      entity.plane = this.PlaneGraphics(planeOpt)

      return this._graphicsLayer.entities.add(entity)
    }
  }

  /**
 * Creates a dynamic polygon with a border, and adds it to the data source.
 *
 * @param {Object} polygonEntity - The entity object to be added to the data source.
 * @param {Object} style - The style options for the border line.
 * @param {Array} dynamicPos - The dynamic positions for the border line.
 * @param {Object} dataSource - The data source to which the polygon and border line will be added ,if null then defaultLayer.
 *
 * @returns {undefined} - This function does not return a value.
 */
  DaymicPolygonWithBorder(polygonEntity, style, dynamicPos, dataSource) {
    // Including the polyline property when drawing a polygon in Cesium can enhance the visual clarity during the drawing process
    // 给面实体一个边缘线 并动态渲染 
    const lineOpt = null;
    Object.assign(lineOpt, style);
    lineOpt.positions = dynamicPos;//动态加载边缘线数据点位置
    polygonEntity.polyline = $this.$graphics.DynamicPolyLineEntity(lineOpt);

    // 面实体 并动态渲染 
    options.positions = dynamicPos;
    polygonEntity.polygon = $this.$graphics.DynamicPolygonEntity(options);
    polygonEntity.clampToS3M = true;

    const _dataSource = dataSource || this._graphicsLayer;
    polyObj = _dataSource.entities.add(polygonEntity);
  };

  // 高级entity
  /**
   * 视频面板
   * @function
   * @param {object} options
   * @param {Cartesian3} options.position - 坐标数组
   * @param {Cartesian2} options.dimensions - 长宽高
   * @param {HTMLElement} options.videoElement - video绑定dom
   * @param {Cartesian3} options.normal - 面板法向方向
   * @returns {plane} 返回plane实例
   */
  VideoPlaneEntity(options) {
    if (options && options.position) {
      let entity = this.createGraphics()
      entity.position = options.position
      entity.plane = {
        plane: new Cesium.Plane(
          options.normal || Cesium.Cartesian3.UNIT_Y,
          0.0
        ),
        dimensions: options.dimensions || new Cesium.Cartesian2(200.0, 150.0),
        material: new Cesium.ImageMaterialProperty({
          image: options.videoElement
        })
      }
      return this._graphicsLayer.entities.add(entity)
    }
  }

  /**
   * GIF广告牌
   * @function
   * @param {object} options
   * @param {Cartesian3} options.position - 坐标数组
   * @param {Cartesian2} options.dimensions - 长宽高
   * @param {string} options.url - 图片
   * @param {Cartesian3} options.normal - 垂直方向
   * @returns {billboard} 返回entity实例
   */
  GifBillboardEntity(options) {
    if (options && options.position) {
      let gif = [],
        url = options.url,
        slow = 6
      const imageProperty = gifLoader(url, gif, slow, '')
      return this._graphicsLayer.entities.add({
        position: options.position,
        billboard: {
          verticalOrigin: Cesium.VerticalOrigin.BASELINE,
          image: imageProperty,
          scale: 0.2
        }
      })
    }
  }
}