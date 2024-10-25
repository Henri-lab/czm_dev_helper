import { DrawingManager, EventManager, LayerManager } from '../../Manager';
import EntityMaker from './EntityMaker';
import { CoordTransformer } from '../../Compute';
import { isValidCartesian3 } from '../../util/isValid';
import { parse_EntityOption } from '../../util/parse';
import TurfUser from '../../Compute/TurfUser';
import * as Cesium from 'cesium';
import CallbackProperty from 'cesium/Source/DataSources/CallbackProperty';
import { I_EntityDrawerClass } from '../../../type/Tool';
import { Updater } from '../../Compute';
import {
  EntityOption,
  ParsedEntityOptions,
  EditorPluginFunction,
} from '../../../type';

/**
 * EntityDrawer class for drawing entities with events on a Cesium viewer with event handling.
 * @class
 */
export default class EntityDrawer
  extends DrawingManager
  implements I_EntityDrawerClass
{
  dfSt: {};
  $entityMaker: EntityMaker;
  _drawLayer: Cesium.CustomDataSource;
  $coords: CoordTransformer;
  $turfer: TurfUser;
  $eM: EventManager;
  defaultImageUrl: string;
  currentHandler: Cesium.ScreenSpaceEventHandler | null;
  fakeLine: any[];
  _fakeLayer: Cesium.CustomDataSource;
  constructor(viewer: Cesium.Viewer, StaticMap = {}) {
    if (!viewer) return;
    console.log('new EntityDrawer class');
    super(viewer);
    this.initLayer('EntityDrawerLayer@henriFox');
    this.dfSt = StaticMap || undefined; //图片资源path
    this.$entityMaker = new EntityMaker(viewer, this._drawLayer);
    this.$coords = new CoordTransformer();
    this.$turfer = new TurfUser(viewer);
    this.$eM = new EventManager(viewer);
    this.defaultImageUrl = '';
    this.currentHandler = null; //方便在removeEventHandler剔除
    this.fakeLine = [];
  }
  initLayer(name: string) {
    const lM = new LayerManager(this.viewer);
    this._drawLayer = lM.addDatasourceByName(name); //保证图层的唯一性
    this._fakeLayer = lM.addDatasourceByName('fakeLayer@henriFox');
  }
  // --辅助函数-----------------------------------------
  // 获得屏幕位置的cartesian
  _getCartesian3FromPX(position: Cesium.Cartesian2): Cesium.Cartesian3 {
    /*pixel*/
    return this.$coords.getCartesianFromScreenPosition(position, this.viewer);
  }
  // 给data设置动态属性 则实体options更改时重新render实体
  _CallBack(data: any): Cesium.CallbackProperty {
    return new Cesium.CallbackProperty(() => {
      return data;
    }, false);
  }
  // 生成动态实体(限制在本图层)的绘制: 解析参数 调用createDynamicEntity
  _createDynamicEntity = (
    typeOfEntity: string,
    entityOption: EntityOption,
    getNewPositions: Function
  ): Cesium.Entity | undefined => {
    let that = this;
    if (typeof getNewPositions !== 'function')
      throw new Error('cannot get new position');
    try {
      // 配置解析
      const parsedEntityOpt = parse_EntityOption(entityOption, {
        datasource: that._drawLayer,
      });

      let Entity = that.$entityMaker.createDynamicEntity(
        typeOfEntity,
        parsedEntityOpt,
        getNewPositions
      );
      return Entity;
    } catch (e) {
      console.error('sth is wrong after mouse left click :', e);
      return;
    }
  };
  // 更新 用于绘制实体的 配置选项的 坐标选项

  /**
   * Entity an entity with event handling.
   * @param {String} Type - The type of the entity.
   * @param {Object} options - The options include extraOption and entityOptions.
   * @param {Function} pluginFunction - Optional plugin function for additional processing.
   * @returns {Cesium.Entity|null} - The created entity or null if viewer or options are not provided.
   */
  drawWithDefaultEvent(
    Type: string,
    options: EntityOption,
    pluginFunction?: EditorPluginFunction
  ): Cesium.Entity | null {
    let isLeftClick = 0;
    const buffer = { Type, options, pluginFunction };
    if (!this.viewer || !options) return null;

    // --数据准备--
    const type = Type.toLowerCase();
    let that = this;
    let $eM = that.$eM;
    let pickedPosCollection = []; //坐标渲染源
    const getNewPositions = () => {
      return pickedPosCollection; //整体坐标
    };
    let _handler_ = $eM.updateHandler();
    that.currentHandler = _handler_; // register the handlers which is working in the class

    // 准备动态实体的数据
    if (options.positions) {
      // 初始化坐标 = 预设坐标 + 鼠标交互坐标
      pickedPosCollection = pickedPosCollection.concat(...options.positions);
    }
    options.positions = pickedPosCollection;
    options.datasource = options.datasource || that._drawLayer; // 默认添至的图层

    // --创建动态实体--
    let currentEntity = that._createDynamicEntity(
      type,
      options,
      getNewPositions
    );
    // console.log(currentEntity, 'currentEntity')

    // --EVENT--
    // fake
    that.fakeDraw(type);
    // set callback function
    const afterLeftClick = (
      movement: Cesium.ScreenSpaceEventHandler.PositionedEvent,
      pickedPos: Cesium.Cartesian3 | undefined,
      pickedObj: Cesium.Entity
    ) => {
      isLeftClick = 1;
      const cartesian = pickedPos;
      if (!cartesian) return;
      pickedPosCollection.push(cartesian); // 更新实体的坐标
      // 特殊处理
      // 1.绘制两点直线
      if (
        type === 'polyline' &&
        options.mode === 'straight' &&
        pickedPosCollection.length == 2
      ) {
        // 暴露实体和坐标渲染源
        if (typeof pluginFunction === 'function') {
          pluginFunction(currentEntity, pickedPosCollection);
        }
        // 画下一条
        if (_handler_) {
          _handler_.destroy();
          _handler_ = null;
        }
        pickedPosCollection = [];
        that.drawWithDefaultEvent(
          buffer.Type,
          buffer.options,
          buffer.pluginFunction
        );
      }
    };
    const afterMouseMove = (
      movement: Cesium.ScreenSpaceEventHandler.MotionEvent
    ) => {
      // mouse movement
      let cartesian = that._getCartesian3FromPX(movement.endPosition);
      //shadow follow 持续更新坐标选项 动态实体会每帧读取
      if (!cartesian) return;
      options.mode === 'follow' &&
        isLeftClick &&
        pickedPosCollection.push(cartesian);
    };
    const afterRightClick = (
      movement: Cesium.ScreenSpaceEventHandler.PositionedEvent
    ) => {
      // right click
      isLeftClick = 0;
      // 更新图形
      const isClose = true;
      let cartesian = that._getCartesian3FromPX(movement.position);
      Updater.updateEntityPosByType(
        type,
        pickedPosCollection,
        cartesian,
        options,
        isClose
      );

      // callback with Entity and Positions
      if (typeof options.after === 'function') {
        if (options.measure) {
          let endPos /*右键点击处catr坐标*/ = that._getCartesian3FromPX(
            movement.position
          );
          const res /*测量结果*/ = that.$turfer.measureSimple(
            type,
            pickedPosCollection
          );
          options.after({
            entity: currentEntity,
            value: res,
            screenXY: movement.position,
            cartXY: endPos,
          });
        } else {
          options.after({
            entity: currentEntity,
          });
        }
      }
      // 执行额外的程序
      if (typeof pluginFunction === 'function') {
        pluginFunction(currentEntity, pickedPosCollection);
      }
      // 画下一条前要销毁事件处理程序
      if (_handler_) {
        _handler_.destroy();
        _handler_ = null;
        console.log('handler destroy');
      }
      pickedPosCollection = [];
      that.drawWithDefaultEvent(
        buffer.Type,
        buffer.options,
        buffer.pluginFunction
      );
    };
    // bind events
    $eM.onMouseClick(afterLeftClick, 1);
    $eM.onMouseMove(afterMouseMove, 1);
    $eM.onMouseRightClick(afterRightClick, 100);
  }

  fakeDraw(type: string, getPos?: Function | null, option?: EntityOption) {
    const _type = type.toLowerCase();
    if (_type === 'polygon') this.fakeDrawPolyLine(getPos, option);
  }
  fakeDrawPolyLine(getPos: Function | null, option: EntityOption) {
    let that = this;
    let index = 0;
    let $eM = that.$eM;
    // console.log('events map',$eM.eventHandlers)
    let polylines = [];
    let getStart: () => Cesium.Cartesian3, getCurrent: () => Cesium.Cartesian3;
    let startPointOfStraightLine: any;
    let isDrawing = false;
    let alreadyCreatePolyline = false;
    let points = [];
    let afterClick2 = (
      movement: Cesium.ScreenSpaceEventHandler.PositionedEvent
    ) => {
      //优先级更高
      isDrawing = true;
      alreadyCreatePolyline = false;
      getStart = () => that._getCartesian3FromPX(movement.position);
      startPointOfStraightLine = getStart();
      console.log(getStart(), '--->');
      let point = that._fakeLayer.entities.add(
        new Cesium.Entity({
          position: startPointOfStraightLine,
          point: {
            color: Cesium.Color.GREEN,
            pixelSize: 15,
            scaleByDistance: new Cesium.NearFarScalar(
              1.5e2 /*150m*/,
              2.0,
              1.5e7,
              0.5
            ), //缩放
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0.0,
              1.5e7
            ), //可视距离
          },
        })
      );
      points.push(point);
    };
    let afterMouseMove2 = (
      movement: Cesium.ScreenSpaceEventHandler.MotionEvent
    ) => {
      getCurrent = () => that._getCartesian3FromPX(movement.endPosition);
      // console.log(getCurrent().x - startPointOfStraightLine.x)
      if (isDrawing && !alreadyCreatePolyline && startPointOfStraightLine) {
        let polyline = that._fakeLayer.entities.add(
          new Cesium.Entity({
            name: 'fakeline' + index++,
            polyline: {
              //   positions: this._CallBack([startPointOfStraightLine, getCurrent() || startPointOfStraightLine]),
              positions: new CallbackProperty(
                () => [
                  startPointOfStraightLine,
                  getCurrent() || points[0].position,
                ],
                false
              ),
              width: option.width || 2,
              material: option.color || Cesium.Color.RED,
              clampToGround: true,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0.0,
                1.5e7
              ), //可视距离
            },
          })
        );
        alreadyCreatePolyline = true;
        // console.log(polylines)
        polylines.push(polyline);
      }
    };
    const afterRightClick2 = () => {
      isDrawing = false;
      const last = polylines.pop();
      last.polyline.show = false;
      that._fakeLayer.entities.remove(last);
    };
    $eM.onMouseClick(afterClick2, 2);
    $eM.onMouseMove(afterMouseMove2, 2);
    $eM.onMouseRightClick(afterRightClick2, 2);
  }
  /**
   * 移除所有实体
   * @function
   */
  removeAll() {
    this._drawLayer.entities.removeAll();
  }
  /**
   * 移除监听事件
   * @function
   */
  removeEventHandler() {
    const _handler = this.currentHandler;
    if (_handler && !_handler.isDestroyed()) {
      _handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      _handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  }
  destroyHandler() {
    const _handler = this.currentHandler;
    if (_handler && !_handler.isDestroyed()) {
      _handler.destroy();
    }
  }
}
