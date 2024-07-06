import { DrawingManager, EventManager, LayerManager } from "../../Manager";
import Graphics from "./Graphics";
import { CoordTransformer } from "../../Compute";
import { isValidCartesian3 } from "../../util/isValid";
import TurfUser from "../../Compute/TurfUser";
import * as Cesium from "cesium";

/**
 * Draw class for drawing entities with events on a Cesium viewer with event handling.
 * @class
 */
export default class Draw extends DrawingManager {
    constructor(viewer, StaticMap = {}) {
        super(viewer);
        this.dfSt = StaticMap || undefined;//图片资源path
        this._drawLayer = new LayerManager(viewer).getOrCreateDatasourceByName('drawLayer@henriFox');//保证图层的唯一性
        this.$graphics = new Graphics(viewer, this._drawLayer);
        this.$coords = new CoordTransformer();
        this.$turfer = new TurfUser(viewer);
        this.viewer && this.viewer.dataSources.add(this._drawLayer);
        this.defaultImageUrl = '';
        this.currentHandler = null;//方便在removeEventHandler剔除
    }
    // --辅助函数-----------------------------------------
    // 获得屏幕位置的cartesian
    _getCartesian3FromPX/*pixel*/ = (position) => {
        return this.$coords.getCartesianFromScreenPosition(position, this.viewer);
    }
    // 给data设置动态属性 则实体options更改时重新render实体
    _setDynamic(data) {
        return new Cesium.CallbackProperty(() => {
            return data;
        }, false)
    }

    // 处理(展示)测量结果
    _measureResultHandle = (res) => {
        console.log(res);
    }

    // 绘制动态实体(限制在本图层)-位置坐标为callbackProperty
    _startDynamicEntity = (typeOfEntity, config, getNewPosition) => {
        if (typeof getNewPosition !== 'function') throw new Error('cannot get new position')

        try {
            let Entity = null;
            const { t_id, name, description/*可随意添加*/, datasource, ...rest } = config;
            const entityConfig = {
                extraOption: {
                    t_id,
                    name,
                    description,
                },
                options: rest,
                getNewPosition, // 每一帧 执行 getNewPosition
                datasource: this._drawLayer,//指定特定图层
            }
            // 这种方法不成立 因为czm_Entity 的polyline被记录为_polyline;
            // 尝试在其添加polyline属性 结果是失败的
            // 而调用_polyline这种czm的私有属性是不合适的，有可能产生风险
            // ——————————————————————————————————————————————————————————-------------
            // // 静态
            // Entity = this.$graphics.createStaticEntity(typeOfEntity, entityConfig);
            // // 为位置添加动态 - 返回 当前~点击收集点~的坐标数组
            // Entity.positions = this._setDynamic(curPosArr)
            // ——————————————————————————————————————————————————————————-------------

            // 换一种方法：直接用czm提供的api 创建 动态属性 的实体
            Entity = this.$graphics.createDynamicEntity(typeOfEntity, entityConfig)
            return Entity;
        } catch (e) {
            console.error('sth is wrong after mouse left click :', e)
            return;
        };
    }

    // 更新 用于绘制实体的 配置选项的 坐标选项 
    _updatePos(options, newPos) {
        options.positions = newPos;
    }
    _updatePosByType(type, pickPosCollection = [], newPickPos = new Cesium.Cartesian3(0, 0, 0), entityOptions = {}, isClose = true) {
        // --多边形闭合--
        if (isClose) {
            if (!type === 'point' || !type === 'polyline') {
                // 首尾相连
                pickPosCollection.push(pickPosCollection[0]);
                this._updatePos(entityOptions, pickPosCollection);
            }
            // 只是为了闭合图形更新 提前返回
            return true;
        }

        // --多边形编辑--
        // 线段 
        if (type === 'polyline' && pickPosCollection.length >= 2) {
            // 端点更新
            pickPosCollection.pop();
            pickPosCollection.push(newPickPos);

        }
        // 矩形(保持2个点)
        else if (type === 'rectangle') {
            if (pickPosCollection.length === 1) {
                // 矩形 端点更新(增加)
                pickPosCollection.push(newPickPos);
            } else {
                // 矩形 端点更新(替换已有点)
                pickPosCollection[1] = newPickPos;
            }
        }
        // 圆形
        else if (type === 'ellipse') {
            // 检测到还没有创建圆的圆心
            if (pickPosCollection.length === 0) return;
            // 缩放半径
            if (pickPosCollection.length === 1) {
                const _center = pickPosCollection[0];
                const _radius = Cesium.Cartesian3.distance(_center, newPickPos);
                const dynamicRadius = this._setDynamic(_radius);//每帧都调用
                entityOptions.semiMajorAxis = dynamicRadius
                entityOptions.semiMinorAxis = dynamicRadius
            }
        }
        // 其他 直接添加数据点
        else {
            pickPosCollection.push(newPickPos);
        }
        // 更新实体的配置选项点坐标 
        this._updatePos(entityOptions, pickPosCollection);
        return true;
    }

    // 核心
    /**
     * Draw an entity with event handling.
     * @param {String} Type - The type of the entity.
     * @param {Object} options - The options for the entity.
     * @param {Function} pluginFunction - Optional plugin function for additional processing.
     * @returns {Cesium.Entity|null} - The created entity or null if viewer or options are not provided.
     */
    drawWithEvent(Type, options, pluginFunction) {
        console.log('drawWithEvent-type:', Type)
        if (!this.viewer || !options) return null;

        // 辅助
        function extra() { // 特殊情况的额外处理
            // 特殊处理:绘制两点直线
            if (options.straight && type === 'polyline' && pickPosCollection.length == 2) {
                // 销毁事件处理程序 结束绘制
                _handlers.destroy();
                _handlers = null;
                // 绘制后的回调 
                if (typeof options.after === "function") {
                    options.after(currentEntity, $this._transformCartesianToWGS84(pickPosCollection),);
                }
            }
        }

        // --数据准备--
        const type = Type.toLowerCase()
        let $this = this
        let eM = new EventManager($this.viewer),
            // 收集click处的坐标
            pickPosCollection = [],
            // 初始化实体
            _entity = $this.MyEntity(),
            currentEntity = this._drawLayer.entities.add(_entity),//添加到此datasource,等待更新后reRender
            // 获取 ~新~ 事件handler程序 ,防止事件绑定间的冲突
            _handlers = eM.handler

        // register the handlers which is working 
        $this.currentHandler = _handlers;

        // --创建动态实体--
        options.positions = pickPosCollection;
        if (!options.datasource) options.datasource = this._drawLayer // 确认准备添至的图层
        
        
        const getNewPosition = () => {
            console.log('getNewPosition')
            // return pickPosCollection[pickPosCollection.length - 1];最后位置
            return pickPosCollection//整体坐标
        }
        currentEntity = $this._startDynamicEntity(type, options, getNewPosition)

        // 特殊处理 
        extra();

        // --EVENT--
        // set callback function
        const afterLeftClick = (movement) => {   // left click
            // 点击处的地理坐标
            let cartesian = $this._getCartesian3FromPX(movement.position /*pixel*/);
            // 检查格式
            if (!cartesian || !isValidCartesian3(cartesian)) return;
            // 收集 点击处的地理坐标
            pickPosCollection.push(cartesian);
            this._updatePos(options);


            // test
            console.log('cur-entity', currentEntity);
            console.log('pickPosCollection-length', pickPosCollection.length);
            console.log('cur-entity-line', currentEntity.polyline);

        }
        const afterMouseMove = (movement) => { // mouse movement 
            let cartesian = $this._getCartesian3FromPX(movement.endPosition);
            // 持续更新坐标选项 动态实体会每帧读取
            if (!cartesian || !isValidCartesian3(cartesian)) return;
            $this._updatePosByType(type, pickPosCollection, cartesian, options)
        }
        const afterRightClick = (movement) => { // right click 

            // 更新图形 truetrue
            const isClose = true;
            $this._updatePosByType(type, pickPosCollection, cartesian, options, isClose);

            //开启测量功能
            if (options.measure) {
                let endPos/*右键点击处地理坐标*/ = $this._getCartesian3FromPX(movement.position);
                const res /*测量结果*/ = $this.$turfer.measureSimple(type, pickPosCollection);
                $this._measureResultHandle({
                    /*...*/
                    entity: currentEntity,
                    value: res,
                    screenXY: movement.position,
                    cartoXY: endPos,
                });
            }


            // 结束绘制
            _handlers.destroy();
            _handlers = null;

            // callback with Entity and Positions
            if (typeof options.after === "function") {
                options.after(currentEntity, $this._transformCartesianToWGS84(pickPosCollection));
            }

            // 执行额外的程序
            const _currentEntity = currentEntity;//当前绘制的实体
            const _currentPosArr = pickPosCollection
            if (typeof pluginFunction === "function") {
                // 交给pluginFunction处理数据
                pluginFunction(_currentEntity, _currentPosArr);
            }
        }
        // bind events
        eM.onMouseClick(afterLeftClick);
        eM.onMouseMove(afterMouseMove);
        eM.onMouseRightClick(afterRightClick);


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



}


// this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
// 为什么放弃创建一个总handler？
// -在 Cesium 中，ScreenSpaceEventHandler 允许你为不同的鼠标和触摸事件设置回调函数。
// --如果你在同一个 ScreenSpaceEventHandler 对象上为同一个事件类型（如 LEFT_CLICK、LEFT_DOUBLE_CLICK 等）设置多个回调函数，这些回调函数不会相互干扰，但后一个会覆盖前一个。
// --也就是说，同一个事件类型只能有一个回调函数，因此如果你需要对同一个事件类型执行多个操作，你需要在一个回调函数中处理所有逻辑。
// -或者! 仍然创建一个公共handler,但是调用之前先清空添加的事件



// test
// PointWithEvent(options, pluginFunction) {
//     this.drawWithEvent('point', options, pluginFunction)
// }
// LineWithEvent(options, pluginFunction) {
//     this.drawWithEvent('polyline', options, pluginFunction);
// }
// PolygonWithEvent(options, pluginFunction) {
//     this.drawWithEvent('polygon', options, pluginFunction)
// }
// RectangleWithEvent(options, pluginFunction) {
//     this.drawWithEvent('rectangle', options, pluginFunction)
// }
// CircleWithEvent(options, pluginFunction) {
//     this.drawWithEvent('ellipse', options, pluginFunction)
// }