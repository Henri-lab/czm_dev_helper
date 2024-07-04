import { DrawingManager, EventManager, LayerManager } from "../../Manager";
import Graphics from "./Graphics";
import { CoordTransformer } from "../../Compute";
import { isValidCartesian3 } from "../../util/isValid";
import TurfUser from "../../Compute/TurfUser";
import * as Cesium from "cesium";


/**
 * 画笔模块
 * @class
 * @param {object} params
 * @param {object} params.viewer - cesium 实例
 * @param {object} params.cesiumGlobal - cesium 全局对象
 * @param {Map} params.defaultStatic - 静态资源
 * @exports Drawer
 */
let datasource = new Cesium.CustomDataSource('graphicsLayer')
export default class Draw extends DrawingManager {
    constructor(viewer, StaticMap = {}) {
        super(viewer);
        this.dfSt = StaticMap || undefined;//图片资源path
        this._drawLayer = new LayerManager(viewer).getOrCreateDatasourceByName('drawLayer@henriFox');//保证图层的唯一性
        this.$graphics = new Graphics(viewer, datasource, this._drawLayer);
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
    // 给data设置动态属性
    _setDynamic(data) {
        return new Cesium.CallbackProperty(() => {
            return data;
        })
    }

    // 处理(展示)测量结果
    _measureResultHandle = (res) => {
        console.log(res);
    }

    // 绘制动态实体(限制在本图层)-位置坐标为callbackProperty
    _startDynamicEntity = (typeOfEntity, config) => {

        try {
            let Entity = null;
            const { oid, name, description/*可随意添加*/, datasource, ...rest } = config;
            const entityConfig = {
                extraOptionL: {
                    oid,
                    name,
                    description,
                },
                options: rest,
                datasource: this._drawLayer,//指定特定图层
            }
            // 静态
            Entity = this.$graphics.createStaticEntity(typeOfEntity, entityConfig);
            // 为位置添加动态
            Entity.positions = this._setDynamic(positions)
            return Entity;
        } catch (e) {
            console.error('sth is wrong after mouse left click :', e)
            return;
        };
    }

    // 更新 用于绘制实体的 配置选项的 坐标选项 
    _updatePos(options) {
        options.positions = positions;
    }
    _updatePosByType(type, pickPosCollection = [], newPickPos = new Cesium.Cartesian3(0, 0, 0), entityOptions = {}, isClose = true) {
        // 多边形闭合
        if (isClose) {
            if (!type === 'point' || !type === 'polyline') {
                // 首尾相连
                pickPosCollection.push(pickPosCollection[0]);
                this._updatePos(entityOptions);
            }
            return;
        }

        // 多边形编辑
        // 线段 
        if (type === 'polyline' && pickPosCollection.length >= 2) {
            // 端点更新
            pickPosCollection.pop();
            pickPosCollection.push(newPickPos);
            this._updatePos(entityOptions);
            return;
        }
        // 矩形
        else if (type === 'rectangle') {
            if (pickPosCollection.length === 1) {
                // 矩形 端点更新(增加)
                pickPosCollection.push(newPickPos);
                this._updatePos(entityOptions);
            } else {
                // 矩形 端点更新(替换已有点)
                pickPosCollection[1] = newPickPos;
                this._updatePos(entityOptions);
            }
            return;
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
            return;
        }
    }

    /**
     * Draw an entity with event handling.
     * @param {String} Type - The type of the entity.
     * @param {Object} options - The options for the entity.
     * @param {Function} pluginFunction - Optional plugin function for additional processing.
     * @returns {Cesium.Entity|null} - The created entity or null if viewer or options are not provided.
     */
    drawWithEvent(Type, options, pluginFunction) {
        if (!this.viewer || !options) return null;

        function extra() { // 特殊情况的额外处理
            // 特殊处理:绘制两点直线
            if (options.straight && type === 'polyline' && positions.length == 2) {
                // 销毁事件处理程序 结束绘制
                _handlers.destroy();
                _handlers = null;
                // 绘制后的回调 
                if (typeof options.after === "function") {
                    options.after(currentEntity, $this._transformCartesianToWGS84(positions),);
                }
            }
        }

        // --数据准备--
        const type = Type.toLowerCase()
        let eM = new EventManager($this.viewer),
            $this = this,
            // 收集click处的坐标
            positions = [],
            // 初始化实体
            _entity = $this.createGraphics(),
            currentEntity = this._drawLayer.entities.add(_entity),//添加到此datasource,等待更新后reRender
            // 获取 ~新~ 事件handler程序 ,防止事件绑定间的冲突
            _handlers = eM.handler

        // register the handlers which is working 
        $this.currentHandler = _handlers;

        // --创建动态实体--
        if (!options.datasource) options.datasource = this._drawLayer // 确认准备添至的图层
        currentEntity = $this._startDynamicEntity(type, options)
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
            positions.push(cartesian);
            update();
        }
        const afterMouseMove = (movement) => { // mouse movement 
            let cartesian = $this._getCartesian3FromPX(movement.endPosition);
            // 持续更新坐标选项 动态实体会每帧读取
            if (!cartesian || !isValidCartesian3(cartesian)) return;
            $this._updatePosByType(type, positions, cartesian, options)
        }
        const afterRightClick = (movement) => { // right click 

            // 更新图形 --闭合
            $this._updatePosByType(type, positions, cartesian, options, true)
            // 多边形拉伸高度
            if (type === 'polygon') {
                currentEntity[type].extrudedHeight = options.extrudeHeight
            }

            let endPos/*右键点击处地理坐标*/ = $this._getCartesian3FromPX(movement.position);

            if (options.measure) {
                //开启测量功能
                const res /*测量结果*/ = $this.$turfer.measureSimple(type, positions);
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
                options.after(currentEntity, $this._transformCartesianToWGS84(positions));
            }

            // 执行额外的程序
            const _currentEntity = currentEntity;//当前绘制的实体
            const _currentPosArr = positions
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
    PointWithEvent(options, pluginFunction) {
        this.drawWithEvent('point', options, pluginFunction)
    }
    LineWithEvent(options, pluginFunction) {
        this.drawWithEvent('polyline', options, pluginFunction);
    }
    PolygonWithEvent(options, pluginFunction) {
        this.drawWithEvent('polygon', options, pluginFunction)
    }
    RectangleWithEvent(options, pluginFunction) {
        this.drawWithEvent('rectangle', options, pluginFunction)
    }
    CircleWithEvent(options, pluginFunction) {
        this.drawWithEvent('ellipse', options, pluginFunction)
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