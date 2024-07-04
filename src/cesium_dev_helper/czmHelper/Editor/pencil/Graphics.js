import { CoordTransformer } from '../../Compute';
import { gifLoader } from '../../Data';
import { DrawingManager } from "../../Manager"
import * as Cesium from 'cesium';
import {
  BillboardGraphics,
  BoxGraphics,
  CorridorGraphics,
  CylinderGraphics,
  EllipseGraphics,
  EllipsoidGraphics,
  LabelGraphics,
  LineGraphics,
  ModelGraphics,
  PathGraphics,
  PlaneGraphics,
  PointGraphics,
  PolygonGraphics,
} from './graphics/index'


/**
 * 图形模块
 * 用于向地图加载各种实体对象*16
 * @class
 * @augments  module:Base
 * @param {object} params
 * @param {object} params.viewer - cesium 实例
 * @param {Array} params.dataSource - 想要添加实体的图层
 * @param {Array} params.defaultStatic - 静态资源
 * @exports  Graphics
 */
export default class Graphics extends DrawingManager {
  constructor(viewer, dataSource, defaultStatic) {
    super(viewer);
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
  createGraphicsByType(type, options) {
    const _type = type.toLowerCase();
    switch (_type) {
      case 'point':
        return PointGraphics(options);
      case 'line':
        return LineGraphics(options);
      case 'polygon':
        return PolygonGraphics(options);
      case 'box':
        return BoxGraphics(options);
      case 'corridor':
        return CorridorGraphics(options);
      case 'cylinder':
        return CylinderGraphics(options);
      case 'ellipse':
        return EllipseGraphics(options);
      case 'ellipsoid':
        return EllipsoidGraphics(options);
      case 'label':
        return LabelGraphics(options);
      case 'path':
        return PathGraphics(options);
      case 'plane':
        return PlaneGraphics(options);
      case 'billboard':
        return BillboardGraphics(options);
      case 'model':
        return ModelGraphics(options);
      default:
        throw new Error(`Unsupported graphic type: ${type}`);
    }

  }
  // 创建实体--------------------------------------------------------

  createEntity(type, options) {
    
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
   * Creates a dynamic rectangle entity that updates based on provided positions.
   *
   * @param {Object} options - The options for creating the rectangle entity.
   * @param {Array<Cesium.Cartesian3>} options.positions - An array of Cartesian3 positions that define the rectangle.
   * @param {string} [options.name] - The name of the rectangle entity.
   * @param {Cesium.Material} [options.material] - The material to be used for the rectangle.
   * @returns {Cesium.Entity} The created rectangle entity.
   */
  DynamicRectangleEntity(options) {
    if (options && options.positions) {
      let entity = this.createGraphics();
      let positions = options.positions;
      entity.name = options.name || '';

      entity.rectangle = {
        coordinates: new Cesium.CallbackProperty(function () {
          if (positions.length < 2) return undefined;
          return Cesium.Rectangle.fromCartesianArray(positions);
        }, false),
        material: options.material || Cesium.Color.BLUE.withAlpha(0.5),
        outline: options.outline || true,
        outlineColor: options.outlineColor || Cesium.Color.BLUE.withAlpha(0.5),
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
   * Creates a dynamic circle entity with the specified options.
   * 
   * @param {Object} options - Options for creating the dynamic circle.
   * @param {Object} options.center - The center of the circle in WGS84 coordinates.
   * @param {number} [options.radius=800] - The radius of the circle.
   * @param {number} [options.rotateAmount=0.05] - The amount of rotation per update.
   * @param {number} [options.height=1] - The height of the circle.
   * @param {number} [options.maxR=10] - max Radius.
   * @param {number} [options.minR=0] - min radius.
   * @param {string} [options.image=""] - Image URL for the circle material.
   * @param {Cesium.MaterialProperty} [options.material] - Custom material for the circle.
   * 
   * @returns {Cesium.Entity} The created circle entity.
   */
  DynamicCircleEntity(options) {
    if (options && options.center) {
      let entity = this.createGraphics(),
        $this = this;

      // Default options
      const defaultOptions = {
        radius: 800,
        rotateAmount: 0.05,
        height: 1,
        scale: null,
        scale2: null,
        image: "",
        material: new Cesium.ImageMaterialProperty({
          image: "",
          transparent: true
        })
      };

      // Assign default values to options if not provided
      options = { ...defaultOptions, ...options };

      // Circle properties
      let dynamicOpt = {},
        heading = 0,
        pitch = 0,
        roll = 0,
        _center = options.center,
        _radius = options.radius,//动态半径
        _maxR = options.maxR,
        _minR = options.minR,
        _rotateAmount = options.rotateAmount,
        _stRotation = 0,
        _height = options.height,
        _material = options.material || new Cesium.ImageMaterialProperty({
          image: options.image || "",
          transparent: true
        });

      let flag = false;

      // 改变radius的增长方向
      let updateScalerAxis = () => {
        if (_radius >= _maxR || _radius <= _minR) {
          flag = !flag;
        }
        flag ? (_radius -= 2) : (_radius += 2);
      };

      // Dynamic circle options
      dynamicOpt = {
        material: _material,
        height: _height,
        semiMajorAxis: new Cesium.CallbackProperty(function () {
          return _radius;
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function () {
          return _radius;
        }, false),
        stRotation:/*旋转角度*/ new Cesium.CallbackProperty(function () {
          if (_rotateAmount > 0) {
            _stRotation += _rotateAmount;
            if (_stRotation >= 360) {
              _stRotation = 0;
            }
          }
          if (_maxR && _minR) updateScalerAxis();
          return _stRotation;
        }, false)
      };

      // Entity position
      entity.position = new Cesium.CallbackProperty(function () {
        return $this.transformWGS84ToCartesian(_center);
      }, false);

      // Entity orientation
      entity.orientation = new Cesium.CallbackProperty(function () {
        return Cesium.Transforms.headingPitchRollQuaternion(
          $this.transformWGS84ToCartesian(_center),
          new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(heading),
            Cesium.Math.toRadians(pitch),
            Cesium.Math.toRadians(roll)
          )
        );
      }, false);

      // Define ellipse graphics for the entity
      entity.ellipse = this.EllipseGraphics(dynamicOpt);

      // Add entity to the graphics layer
      return this._graphicsLayer.entities.add(entity);
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
  DynamicPolygonWithBorder(polygonEntity, dynamicPos, style, dataSource) {
    // Including the polyline property when drawing a polygon in Cesium can enhance the visual clarity during the drawing process
    // 给面实体一个边缘线 并动态渲染 
    const lineOpt = null;
    Object.assign(lineOpt, style);
    lineOpt.positions = dynamicPos;//动态加载边缘线数据点位置
    polygonEntity.polyline = this.DynamicPolyLineEntity(lineOpt);

    // 面实体 并动态渲染 
    options.positions = dynamicPos;
    polygonEntity.polygon = this.DynamicPolygonEntity(options);
    polygonEntity.clampToS3M = true;

    const _dataSource = dataSource || this._graphicsLayer;
    return _dataSource.entities.add(polygonEntity);
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