import { CoordTransformer } from '../../Compute';
import { gifLoader } from '../../Data';
import { DrawingManager } from "../../Manager"
import * as Cesium from 'cesium';
import { isValidCartesian3, isValidCartographic } from "../../util/isValid";
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

import {
  BoxEntity,
  CorridorEntity,
  EllipseEntity,
  LineEntity,
  ModelEntity,
  PointEntities,
  PolygonEntity,
} from './entities'

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
  constructor(viewer, dataSource) {
    if (viewer)
      super(viewer);
    this._graphicsLayer = dataSource || new Cesium.CustomDataSource('graphicsLayer')
    this.viewer && this.viewer.dataSources.add(this._graphicsLayer)
    // method for initing the graphics 
    this.PointGraphics = PointGraphics
    this.LineGraphics = LineGraphics
    this.PolygonGraphics = PolygonGraphics
    this.LabelGraphics = LabelGraphics
    this.BillboardGraphics = BillboardGraphics
    this.PathGraphics = PathGraphics
    this.ModelGraphics = ModelGraphics
    this.EllipseGraphics = EllipseGraphics
    this.EllipsoidGraphics = EllipsoidGraphics
  }



  //  创建一个czm帧刷新属性
  updatePerFrame(data, isConst = false) {
    return new Cesium.CallbackProperty(function () {
      return data
    }, isConst)
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

  /**
   * 创建复合实体 
   * @param {object} extraOption - 实体非主体属性
   * @param {object} options - 实体主体属性
   * @returns {Entity} 返回Entity实例
   */
  createEntities(extraOption = {}, options = {}) {
    let entity = this._graphicsLayer.entities.add({
      ...extraOption,
      point: options.point && this.PointGraphics(options.point),
      polyline: options.line && this.LineGraphics(options.line),
      polygon: options.polygon && this.PolygonGraphics(options.polygon),
      label: options.label && this.LabelGraphics(options.label),
      billboard: options.billboard && this.BillboardGraphics(options.billboard),
      path: options.path && this.PathGraphics(options.path),
      model: options.model && this.ModelGraphics(options.model),
      ellipse: options.ellipse && this.EllipseGraphics(options.ellipse),
      ellipsoid: options.ellipsoid && this.EllipsoidGraphics(options.ellipsoid),
    });

    return entity;
  }

  // 创建静态实体--------------------------------------------------------
  createStaticEntity(type, { extraOption, options, datasource }) {
    const _type = type.toLowerCase();
    switch (_type) {
      case 'point':
        return PointEntities(extraOption, options, datasource);
      case 'line':
        return LineEntity(extraOption, options, datasource);
      case 'polygon':
        return PolygonEntity(extraOption, options, datasource);
      case 'box':
        return BoxEntity(extraOption, options, datasource);
      case 'corridor':
        return CorridorEntity(extraOption, options, datasource);
      case 'ellipse':
        return EllipseEntity(extraOption, options, datasource);
      case 'model':
        return ModelEntity(extraOption, options, datasource);
      default:
        throw new Error(`Unsupported entity type: ${type}`);
    }
  }
  // 创建动态实体--------------------------------------------------------

  /**
   * Creates a dynamic entity with the specified options.
   *
   * @param {Object} [extraOption={}] - Options for the entity.
   * @param {Object} [options={}] - Options for the dynamic entity.
   * @param {Function} getNewPosition - Function to get new position for the dynamic entity.
   * @param {Array} [pickPosCollection=[]] - Collection of pick positions for the dynamic entity.
   *
   * @throws {Error} If getNewPosition is not a function.
   *
   * @returns {Object} The created dynamic entity.
   */
  createDynamicEntity(extraOption = {}, options = {}, getNewPosition, pickPosCollection = []) {
    if (typeof getNewPosition !== 'function') throw new Error('cannot get new position')

    let _newPosition = getNewPosition();

    let cartesian3;
    if (isValidCartographic(_newPosition)) {
      cartesian3 = CoordTransformer.transformWGS84ToCartesian(_newPosition)
    } else if (isValidCartesian3(_newPosition)) {
      cartesian3 = _newPosition
    }

    let entity = this.createEntities(extraOption = {}, options = {})

    const type = extraOption.type.toLowerCase();
    if (type === 'polygon') {
      const Hierarchy = (pos) => {
        return new Cesium.PolygonHierarchy(pos);
      }
      entity.polygon.hierarchy = this.updatePerFrame(Hierarchy(cartesian3))// 核心
    }

    else if (type === 'rectangle') {
      const Rectangle = (posArr) => {
        // rectangle 至少需要两个点
        if (posArr.length < 2) throw new Error('Invalid positions when creating rectangle');
        return Cesium.Rectangle.fromCartesianArray(posArr);
      }
      entity.rectangle.coordinates = this.updatePerFrame(Rectangle(pickPosCollection))//核心
    }

    else {
      entity[type].positions = this.updatePerFrame(cartesian3) // 核心
    }
    return entity//dynamic entity
  }


















  //高级entity-------------------------------------------------
  

  


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