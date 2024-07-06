import { CoordTransformer } from '../../Compute';
import { DrawingManager, LayerManager } from "../../Manager"
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
  SampleEntity
} from './entities'

/**
 * A class for managing and creating graphics and entities in a Cesium viewer.
 *
 * @class
 * @param {Cesium.Viewer} viewer - The Cesium viewer instance.
 * @param {Cesium.DataSource} dataSource - The data source for the graphics.
 */

export default class Graphics extends DrawingManager {
  constructor(viewer, dataSource) {
    if (viewer)
      super(viewer);
    this._graphicsLayer = new LayerManager(viewer).getOrCreateDatasourceByName('graphicsLayer@henriFox');//保证图层的唯一性
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
  czm_callbackProperty(data, isConst = false) {
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
      case 'polyline':
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

  // 生成实体---------------------------------------------------------------------
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

  /**
   * Creates a static entity with the specified options.
   *
   * @param {string} type - The type of entity to create.
   * @param {object} options - The options for the static entity.
   * @param {object} extraOption - Additional options for the entity.
   * @param {Cesium.DataSource} datasource - The data source for the entity.
   *
   * @throws {TypeError} If an unsupported entity type is provided.
   *
   * @returns {Cesium.Entity} The created static entity.
   */
  // 创建静态实体--------------------------------------------------------
  createStaticEntity(type, { extraOption, options, datasource }) {
    const _type = type.toLowerCase();
    switch (_type) {
      case 'point':
        return PointEntities(extraOption, options, datasource);
      case 'polyline':
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
  createDynamicEntity(type, { extraOption, options, getNewPosition, pickPosCollection, datasource }) {
    if (typeof getNewPosition !== 'function') throw new Error('cannot get new position')

    let _newPositions = getNewPosition();

    /** 
     * @pickPosCollection {Cartesian3}
    */
    let curPosArr;
    if (isValidCartographic(_newPositions)) {
      curPosArr = CoordTransformer.transformWGS84ToCartesian(_newPositions)
    } else if (isValidCartesian3(_newPositions)) {
      curPosArr = _newPositions
    }

    /**@normalObj */
    let entity = {};

    // bind graphics👻
    entity[_type] = this.createGraphicsByType(_type, options);

    const _type = type.toLowerCase();
    if (_type === 'polygon') {
      const Hierarchy = (pos) => {
        return new Cesium.PolygonHierarchy(pos);
      }
      entity.polygon.hierarchy = this.czm_callbackProperty(Hierarchy(curPosArr))// 核心
    }

    else if (_type === 'rectangle') {
      const Rectangle = (posArr) => {
        // rectangle 至少需要两个点
        if (posArr.length < 2) throw new TypeError('Invalid positions when creating rectangle');
        return Cesium.Rectangle.fromCartesianArray(posArr);//西南东北 w s e n
      }
      entity.rectangle.coordinates = this.czm_callbackProperty(Rectangle(pickPosCollection))//核心
    }

    else if (_type === 'polyline') {
      entity.polyline.positions = this.czm_callbackProperty(curPosArr) // 核心
    }

    else {
      entity.positions = this.czm_callbackProperty(curPosArr)// 核心
    }

    const finalEntity = {
      ...extraOption,
      ...entity,// 已经绑定graphics 并且将坐标数据设置为动态
    }

    return datasource.entities.add(finalEntity)//dynamic entity
  }

  //创建高级entity-------------------------------------------------
  createAdvancedEntity(type, { extraOption, options, datasource }) {
    const _type = type.toLowerCase();
    switch (_type) {
      case 'sample':
        return SampleEntity(extraOption, options, datasource, this.viewer);
      default:
        throw new TypeError(`Unsupported advanced entity type: ${type}`);
    }




  }
}


