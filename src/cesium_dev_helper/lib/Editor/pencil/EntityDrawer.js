import { DrawingManager, EventManager, LayerManager } from "../../Manager";
import EntityMaker from "./EntityMaker";
import { CoordTransformer } from "../../Compute";
import { isValidCartesian3 } from "../../util/isValid";
import TurfUser from "../../Compute/TurfUser";
import * as Cesium from "cesium";
import { get } from "@/util/methods";
/**
 * EntityDrawer class for drawing entities with events on a Cesium viewer with event handling.
 * @class
 */
export default class EntityDrawer extends DrawingManager {
    constructor(viewer, StaticMap = {}) {
        if (!viewer) return;
        console.log('new EntityDrawer class');
        super(viewer);
        this.initLayer('EntityDrawerLayer@henriFox')
        this.dfSt = StaticMap || undefined;//图片资源path
        this.$entityMaker = new EntityMaker(viewer, this._drawLayer);
        this.$coords = new CoordTransformer();
        this.$turfer = new TurfUser(viewer);
        this.defaultImageUrl = '';
        this.currentHandler = null;//方便在removeEventHandler剔除
        this.fakeLine = [];
    }
    initLayer(name) {
        const lM = new LayerManager(this.viewer)
        this._drawLayer = lM.addDatasourceByName(name);;//保证图层的唯一性
        this._fakeLayer = lM.addDatasourceByName('fakeLayer@henriFox')
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
    _parseConfig(entityOption) {
        const { t_id, name, description/*可随意添加*/, datasource, ...rest } = entityOption;
        const parsedEntityOpt = {
            extraOption: {
                t_id,
                name,
                description,
            },
            graphicOption: rest,
            datasource: datasource || this._drawLayer,//默认加载图层
        }
        return parsedEntityOpt;
    }
    // 开始准备动态实体(限制在本图层)的绘制
    // 解析参数 调用createDynamicEntity的中间件 
    _startDynamicEntity = (typeOfEntity, entityOption, getNewPosition) => {
        let that = this
        if (typeof getNewPosition !== 'function') throw new Error('cannot get new position')
        try {
            // 配置解析
            const parsedEntityOpt = that._parseConfig(entityOption);
            let Entity = that.$entityMaker.createDynamicEntity(typeOfEntity, parsedEntityOpt, getNewPosition)
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
    _updatePosByType(type, pickedPosCollection = [], newPickPos = new Cesium.Cartesian3(0, 0, 0), entityOptions = {}, isClose = true) {
        // --多边形闭合--
        if (isClose) {
            if (!type === 'point' || !type === 'polyline') {
                // 首尾相连
                pickedPosCollection.push(pickedPosCollection[0]);
                this._updatePos(entityOptions, pickedPosCollection);
            }
            // 只是为了闭合图形更新 提前返回
            return true;
        }

        // --多边形编辑--
        // 线段 
        if (type === 'polyline' && pickedPosCollection.length >= 2) {
            // 端点更新
            pickedPosCollection.pop();
            pickedPosCollection.push(newPickPos);

        }
        // 矩形(保持2个点)
        else if (type === 'rectangle') {
            if (pickedPosCollection.length === 1) {
                // 矩形 端点更新(增加)
                pickedPosCollection.push(newPickPos);
            } else {
                // 矩形 端点更新(替换已有点)
                pickedPosCollection[1] = newPickPos;
            }
        }
        // 圆形
        else if (type === 'ellipse') {
            // 检测到还没有创建圆的圆心
            if (pickedPosCollection.length === 0) return;
            // 缩放半径
            if (pickedPosCollection.length === 1) {
                const _center = pickedPosCollection[0];
                const _radius = Cesium.Cartesian3.distance(_center, newPickPos);
                const dynamicRadius = this._setDynamic(_radius);//每帧都调用
                entityOptions.semiMajorAxis = dynamicRadius
                entityOptions.semiMinorAxis = dynamicRadius
            }
        }
        // 其他 直接添加数据点
        else {
            pickedPosCollection.push(newPickPos);
        }
        // 更新实体的配置选项点坐标 
        this._updatePos(entityOptions, pickedPosCollection);
        return true;
    }
    /**
     * Entity an entity with event handling.
     * @param {String} Type - The type of the entity.
     * @param {Object} options - The options include extraOption and entityOptions.
     * @param {Function} pluginFunction - Optional plugin function for additional processing.
     * @returns {Cesium.Entity|null} - The created entity or null if viewer or options are not provided.
     */
    drawWithDefaultEvent(Type, options, pluginFunction) {
        console.log('wait drawing:', Type, '-mode:', options.mode)
        let clickFlag = 0
        const buffer = { Type, options, pluginFunction }
        if (!this.viewer || !options) return null;

        // --数据准备--
        const type = Type.toLowerCase()
        let that = this
        let eM = new EventManager(that.viewer),
            // 收集click处的坐标
            pickedPosCollection = [],
            // 获取 ~新~ 事件handler程序 ,防止事件绑定间的冲突
            _handler_ = eM.handler

        // register the handlers which is working 
        that.currentHandler = _handler_;

        // 准备动态实体的数据
        options.positions = pickedPosCollection;
        if (!options.datasource) options.datasource = that._drawLayer // 默认添至的图层

        const getNewPosition = () => {
            // return pickedPosCollection[pickedPosCollection.length - 1];最后位置
            return pickedPosCollection//整体坐标
        }
        // --创建动态实体--
        let currentEntity = that._startDynamicEntity(type, options, getNewPosition)
        // console.log(currentEntity, 'currentEntity')

        // --EVENT--
        // set callback function
        const afterLeftClick = (movement, pickedPos, pickedObj) => {   // left click
            clickFlag = 1
            // 点击处的直角坐标
            const cartesian = pickedPos;
            // 检查格式
            if (!cartesian || !isValidCartesian3(cartesian)) return;
            // 收集 点击处的地理坐标
            pickedPosCollection.push(cartesian); // 更新实体的坐标
            // 特殊处理 
            // 1.绘制两点直线
            if (type === 'polyline' && options.mode === 'straight' && pickedPosCollection.length == 2) {
                // 执行额外的程序
                if (typeof pluginFunction === "function") {
                    pluginFunction(currentEntity, pickedPosCollection);
                }
                // 画下一条
                if (_handler_) {
                    _handler_.destroy();
                    _handler_ = null;
                }
                pickedPosCollection = [];
                that.drawWithDefaultEvent(buffer.Type, buffer.options, buffer.pluginFunction);
            }

            if (type === 'polygon') {
                if (pickedPosCollection.length == 2) {
                    this.fakeLine.push(this.fakeDraw(getNewPosition, options))
                } else if (pickedPosCollection.length == 3) {
                    this._fakeLayer.entities.remove(this.fakeLine.pop())
                }
            }
        }
        const afterMouseMove = (movement) => { // mouse movement 
            let cartesian = that._getCartesian3FromPX(movement.endPosition);
            //shadow follow 持续更新坐标选项 动态实体会每帧读取 
            if (!cartesian || !isValidCartesian3(cartesian)) return;
            (options.mode === 'follow' && clickFlag) && pickedPosCollection.push(cartesian);
        }
        const afterRightClick = (movement) => { // right click 
            clickFlag = 0
            // 更新图形
            const isClose = true;
            that._updatePosByType(type, pickedPosCollection, {}, options, isClose);

            // callback with Entity and Positions
            if (typeof options.after === "function") {
                if (options.measure) {
                    let endPos/*右键点击处catr坐标*/ = that._getCartesian3FromPX(movement.position);
                    const res /*测量结果*/ = that.$turfer.measureSimple(type, pickedPosCollection);
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
            if (typeof pluginFunction === "function") {
                pluginFunction(currentEntity, pickedPosCollection);
            }
            // 画下一条前要销毁事件处理程序
            if (_handler_) {
                _handler_.destroy();
                _handler_ = null;
            }
            pickedPosCollection = [];
            that.drawWithDefaultEvent(buffer.Type, buffer.options, buffer.pluginFunction);
        }
        // bind events
        eM.onMouseClick(afterLeftClick);
        eM.onMouseMove(afterMouseMove);
        eM.onMouseRightClick(afterRightClick);
    }

    fakeDraw(getPos, option) {
        return this._fakeLayer.entities.add(new Cesium.Entity({
            position: getPos(),
            polyline: {
                ...option
            }
        }));
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
