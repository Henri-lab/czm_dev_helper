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
  /**
 * Creates a graphic of the specified type with the given options.
 *
 * @param {string} type - The type of graphic to create.
 * @param {object} options - The options for the graphic.
 *
 * @throws {Error} If an unsupported graphic type is provided.
 *
 * @returns {object} The created graphic.
 */
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
        throw new TypeError(`Unsupported graphic type: ${type}`);
    }

  }

  // 创建复合实体 
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
        throw new TypeError(`Unsupported entity type: ${type}`);
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
  createDynamicEntity(type, { extraOption, options, getNewPosition, pickPosCollection }) {
    if (typeof getNewPosition !== 'function') throw new Error('cannot get new position')

    let _newPosition = getNewPosition();

    let cartesian3;
    if (isValidCartographic(_newPosition)) {
      cartesian3 = CoordTransformer.transformWGS84ToCartesian(_newPosition)
    } else if (isValidCartesian3(_newPosition)) {
      cartesian3 = _newPosition
    }

    let entity = this.createEntities(extraOption = {}, options)

    const _type = type.toLowerCase();
    if (_type === 'polygon') {
      const Hierarchy = (pos) => {
        return new Cesium.PolygonHierarchy(pos);
      }
      entity.polygon.hierarchy = this.updatePerFrame(Hierarchy(cartesian3))// 核心
    }

    else if (_type === 'rectangle') {
      const Rectangle = (posArr) => {
        // rectangle 至少需要两个点
        if (posArr.length < 2) throw new TypeError('Invalid positions when creating rectangle');
        return Cesium.Rectangle.fromCartesianArray(posArr);//西南东北 w s e n
      }
      entity.rectangle.coordinates = this.updatePerFrame(Rectangle(pickPosCollection))//核心
    }

    else {
      entity[_type].positions = this.updatePerFrame(cartesian3) // 核心
    }
    return entity//dynamic entity
  }

  //高级entity-------------------------------------------------





}