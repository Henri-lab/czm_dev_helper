import { DrawingManager, EventManager } from "../../Manager";
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
        this._drawLayer = new Cesium.CustomDataSource("drawLayer");
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
    // 给坐标设置动态属性
    _setDynamic(pos) {
        return new Cesium.CallbackProperty(() => {
            return pos;
        })
    }

    // 处理(展示)测量结果
    _measureResultHandle = (res) => {
        console.log(res);
    }

    // 绘制动态实体-位置坐标为callbackProperty
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
                datasource,
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
    _updatePosByType(type, pickPosCollection = [], newPos = new Cesium.Cartesian3(0, 0, 0), entityOptions = {}, isClose = true) {

        // 线段 
        if (type === 'polyline' && pickPosCollection.length >= 2) {
            // 端点更新
            pickPosCollection.pop();
            pickPosCollection.push(newPos);
            this._updatePos(entityOptions);
        }
        // 矩形
        else if (type === 'rectangle') {
            if (pickPosCollection.length === 1) {
                // 矩形 端点更新(增加)
                pickPosCollection.push(newPos);
                this._updatePos(entityOptions);
            } else {
                // 矩形 端点更新(替换已有点)
                pickPosCollection[1] = newPos;
                this._updatePos(entityOptions);
            }
        } else {

        }

        // 多边形闭合
        if (isClose) {
            if (!type === 'point' || !type === 'polyline') {
                // 首尾相连
                pickPosCollection.push(pickPosCollection[0]);
                this._updatePos(entityOptions);
            }
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



    /**
    * Draws a point on the map.
    * @function
    * @param {object} options - The options for drawing the point entity.
    * @param {function} options.callback - The callback function to be called after drawing the point. 并且把实体回调出去
    * @returns {Entity} - The entity
    */
    PointWithEvent(options) {
        if (!this.viewer || !options) return null;

        let $this = this //解决非箭头函数的this问题
        options = options || {};
        /** @default */
        options.style = options.style || {
            image: this._getDfSt(["drawPointGraphics"]),
            width: 35,
            height: 40,
            clampToGround: true,
            scale: 1,
            pixelOffset: new Cesium.Cartesian2(0, -20),
        };

        let _point = $this.$graphics.PointEntities(options),
            position,
            positions = [],
            poiObj,
            _handlers = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        // Get handler
        drawHandler = _handlers;
        // Left click event handler
        _handlers.setInputAction(function (movement) {
            let cartesian = $this.viewer.scene.camera.pickEllipsoid(movement.position, $this.viewer.scene.globe.ellipsoid);
            if (cartesian && isValidCartesian3(cartesian)) {
                position = cartesian;
                positions.push(cartesian);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // Right click event handler
        _handlers.setInputAction(function (movement) {
            _handlers.destroy();
            _handlers = null;

            if (typeof options.callback === "function") {
                options.callback($this.transformCartesianToWGS84(positions), poiObj/*把实体回调出去*/);
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        _point.position = new Cesium.CallbackProperty(function () {
            return position;
        }, false);

        poiObj = this._drawLayer.entities.add(_point);

    }

    /**
    * Draws a line on the map.
    * @param {Object} options - The options for drawing the line.
    * @param {Number} [options.width=5] - The width of the line.
    * @param {Cesium.Color} [options.material=Cesium.Color.BLUE.withAlpha(0.8)] - The material of the line.
    * @param {Boolean} [options.clampToGround=false] - Whether the line should be clamped to the ground.
    * @param {Boolean} [options.clampToS3M=false] - Whether the line should be clamped to 3D Tiles.
    * @param {Boolean} [options.measure=false] - Whether the line should be measured.
    * @param {Boolean} [options.straight] - The type of the line.
    * @param {Function} [options.callback] - The callback function to be called when the line is drawn.
    * @returns {undefined}
    */
    LineWithEvent(options, pluginFunction) {
        this.drawWithEvent('polyline', options, pluginFunction);
    }

    /**
     * Draws a polygon on the map.
     * 
     * LEFT_CLICK: Adds vertices to the polygon.
     * 
     * MOUSE_MOVE: Updates the polygon dynamically as the mouse moves.
     * 
     * RIGHT_CLICK: Finalizes the polygon by closing it and executing the callback,IF you measure is true,will return area to this entity.
     * @function
     * @param {object} options
     * @param {boolean} options.style - 边缘线样式
     * @param {boolean} options.measure - 是否为量测
     * @param {number} options.height - 拉伸高度
     * @param {boolean} options.clampToGround - 是否贴地
     * @param {function} options.callback - 回调函数
    */
    PolygonWithEvent(options = {}) {
        if (!this.viewer || !options) return null;

        let $this = this;

        // Default edge style
        const defaultStyle = {
            width: 3,
            material: Cesium.Color.BLUE.withAlpha(0.8),
            clampToGround: true,
        };
        options.style = options.style || defaultStyle;

        let _positions = [], // Click coordinates collection
            _polygonEntity = $this.createGraphics(),
            polyObj = null, // Callback entity
            _handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        // Register the handler
        drawHandler = _handler;

        $this._drawLayer.entities.add(_polygonEntity);

        // Left-click to add vertices
        _handler.setInputAction(function (movement) {
            let cartesian = $this._getCartesian3FromPX(movement.position);
            if (cartesian && isValidCartesian3(cartesian)) {
                _positions.push(cartesian.clone());

                if (!polyObj) {
                    polyObj = $this.$graphics.DynamicPolygonWithBorder(_polygonEntity, options.style, _positions);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Mouse move to dynamically update the polygon
        _handler.setInputAction(function (movement) {
            let cartesian = $this._getCartesian3FromPX(movement.endPosition);
            // Three+ points make a surface
            if (_positions.length >= 2 && cartesian && isValidCartesian3(cartesian)) {
                _positions.pop();
                _positions.push(cartesian);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // Right-click to finalize the polygon
        _handler.setInputAction(function () {
            _handler.destroy();

            _polygonEntity.polygon.material = options.material || Cesium.Color.BLUE.withAlpha(0.5);
            _polygonEntity.polygon.clampToGround = options.clampToGround || true;

            // Closing the polygon
            _positions.push(_positions[0]);

            // Specify extruded height
            if (options.height) {
                _polygonEntity.polygon.extrudedHeight = options.height;
            }

            // Enable measurement functionality
            if (options.measure) {
                let cartesian = $this._getCartesian3FromPX(movement.position);
                const area = $this.$turfer.measureSimple('polygon', _positions);
                if (area) {
                    _polygonEntity.area = area;
                    $this.measureResult(
                        {
                            draw: 'PolygonWithEvent',
                            measureResult: area,
                            pickPos: cartesian
                        }
                    )
                }
            }

            // Trigger right-click callback
            if (typeof options.callback === "function") {
                options.callback($this.transformCartesianToWGS84(_positions), polyObj);
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    /**
    * Draws a rectangle on the map.
    * 
    * LEFT_CLICK: Adds vertices to the rectangle.
    * 
    * MOUSE_MOVE: Updates the rectangle dynamically as the mouse moves.
    * 
    * RIGHT_CLICK: Finalizes the rectangle by closing it and executing the callback,IF you measure is true,will return area to this entity.
    * @function
    * @param {object} options
    * @param {object} options.style - The style of the rectangle's edge.
    * @param {boolean} options.measure - Whether the rectangle should be measured.
    * @param {number} options.height - The extruded height of the rectangle.
    * @param {boolean} options.clampToGround - Whether the rectangle should be clamped to the ground.
    * @param {function} options.callback - The callback function to be called when the rectangle is drawn.
    * @returns {undefined}
    */
    RectangleWithEvent(options = {}) {
        if (!this.viewer || !options) return null;

        let $this = this;


        // Default edge style
        const defaultStyle = {
            width: 3,
            material: Cesium.Color.BLUE.withAlpha(0.8),
            clampToGround: true,
        };
        options.style = options.style || defaultStyle;

        let _positions = [], // Click coordinates collection
            _rectangleEntity = $this.createGraphics(),
            rectObj = null, // Callback entity
            _handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        // Register the handler
        drawHandler = _handler;

        $this._drawLayer.entities.add(_rectangleEntity);

        // Left-click to add vertices
        _handler.setInputAction(function (movement) {
            let cartesian = $this._getCartesian3FromPX(movement.position);
            if (cartesian && isValidCartesian3(cartesian)) {
                _positions.push(cartesian.clone());

                // A rectangle in Cesium can be defined by specifying the coordinates of two opposite corners
                if (_positions.length === 2 && !rectObj) {
                    options.position = _positions;
                    rectObj = $this.$graphics.DynamicRectangleEntity(options);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Mouse move to dynamically update the rectangle
        _handler.setInputAction(function (movement) {
            if (_positions.length < 1) return;

            let cartesian = $this._getCartesian3FromPX(movement.endPosition);
            if (cartesian && isValidCartesian3(cartesian)) {
                if (_positions.length === 1) {
                    _positions.push(cartesian);
                } else {
                    _positions[1] = cartesian;
                }

                // 实体创建后进行更新
                if (rectObj) {
                    rectObj.rectangle.coordinates = new Cesium.CallbackProperty(function () {
                        const rect = Cesium.Rectangle.fromCartesianArray(_positions);
                        return rect;
                    }, false);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // Right-click to finalize the rectangle
        _handler.setInputAction(function () {
            _handler.destroy();

            // Trigger right-click callback
            if (typeof options.callback === "function") {
                options.callback($this.transformCartesianToWGS84(_positions), rectObj);
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    // circle-is-Ellipse
    /**
     * Draws a circle on the map.
     * 
     * LEFT_CLICK: Adds the center point of the circle.
     * 
     * MOUSE_MOVE: Updates the circle dynamically as the mouse moves.
     * 
     * RIGHT_CLICK: Finalizes the circle by closing it and executes the callback.
     * 
     * @function
     * @param {object} options
     * @param {object} options.style - The style of the circle's edge.
     * @param {boolean} options.measure - Whether the circle should be measured.
     * @param {number} options.height - The extruded height of the circle.
     * @param {boolean} options.clampToGround - Whether the circle should be clamped to the ground.
     * @param {function} options.callback - The callback function to be called when the circle is drawn.
     * @returns {undefined}
     */
    CircleWithEvent(options = {}) {
        if (!this.viewer || !options) return null;

        let $this = this;

        // Default edge style
        const defaultStyle = {
            width: 3,
            material: Cesium.Color.BLUE.withAlpha(0.8),
            clampToGround: true,
        };
        options.style = options.style || defaultStyle;

        let _positions = [], // Click coordinates collection
            _circleEntity = $this.createGraphics(),
            circleObj = null, // Callback entity
            _handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        // Register the handler
        drawHandler = _handler;

        $this._drawLayer.entities.add(_circleEntity);

        // Left-click to add center point
        _handler.setInputAction(function (movement) {
            let cartesian = $this._getCartesian3FromPX(movement.position);
            if (cartesian && isValidCartesian3(cartesian)) {
                _positions.push(cartesian.clone());

                if (_positions.length === 1 && !circleObj) {
                    // 创建一个静态圆
                    circleObj = $this.$graphics.EllipseGraphics(options);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Mouse move to dynamically update the circle
        _handler.setInputAction(function (movement) {
            if (_positions.length < 1) return;

            let cartesian = $this._getCartesian3FromPX(movement.endPosition);
            if (cartesian && isValidCartesian3(cartesian)) {
                const center = _positions[0];
                const radius = Cesium.Cartesian3.distance(center, cartesian);

                // 动态更新圆实体
                if (circleObj) {
                    circleObj.ellipse.semiMajorAxis = new Cesium.CallbackProperty(function () {
                        return radius;
                    }, false);
                    circleObj.ellipse.semiMinorAxis = new Cesium.CallbackProperty(function () {
                        return radius;
                    }, false);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // Right-click to finalize the circle
        _handler.setInputAction(function () {
            _handler.destroy();

            // Trigger right-click callback
            if (typeof options.callback === "function") {
                options.callback($this.transformCartesianToWGS84(_positions), circleObj);
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
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