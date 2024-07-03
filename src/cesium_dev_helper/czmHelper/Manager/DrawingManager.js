// 提供最基本的绘画功能
import { CoordTransformer } from "../Compute";
import Manager from "./Manager";

let Cesium = new Manager().Cesium;
class DrawingManager extends Manager {
    constructor(viewer) {
        super(viewer);
    }

    // 公共方法--------------------------------------------------------
    /**
      * 判断对象是否有某个属性
      * @private
      * @param {object} obj 对象
      * @param {string} field  属性字段
      * @param {string} defVal  默认返回
      * @returns {string}
      */
    _objHasOwnProperty(obj, field, defVal) {
        return obj.hasOwnProperty(field) ? obj.field : defVal
    }

    /**
     * 批量设置对象属性
     * @private
     * @param {object} obj -需要改造的对象
     * @param {Array<Object>} properties - 属性图数组
     * @returns {Object} -修改后属性的对象
     */
    _setProperties(obj, properties) {
        properties.forEach(property => {
            obj[property.key] = this._objHasOwnProperty(options, property.key, property.defaultValue);
        });
        return obj;
    }

    /**
    * 创建一个实体
    * @returns {Object} 实体空对象（带签名）
    */
    createGraphics() {
        let entity = new Cesium.Entity();

        // author sign
        Object.defineProperty(entity, Auther, {
            value: 'henriFox',
            writable: false,    // 不可写
            configurable: false // 不可配置
        });

        return entity;
    }

    /**
   * 设置实体的旋转属性
   * @function
   * @param {Object} options 
   * @param {Cesium.Entity} options.entity - 需要设置的实体
   * @param {Cesium.Cartesian3} options.position - 实体的位置
   * @param {number} options.rotateAmount - 旋转量（度数）
   */
    setGraphicsRotate({ entity, position, rotateAmount }) {
        // 将位置转换为WGS84坐标
        const wgs84Position = transformCartesianToWGS84(position);

        // 创建旋转矩阵
        const rotateAmountRadians = Cesium.Math.toRadians(rotateAmount);
        const rotationMatrix = Cesium.Matrix3.fromRotationZ(rotateAmountRadians);

        // 将旋转矩阵应用到实体
        entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
            wgs84Position,
            new Cesium.HeadingPitchRoll(rotateAmountRadians, 0, 0)
        );

        // 设置实体的位置
        entity.position = wgs84Position;
    }

    /**
    * 设置图形浮动
    * @function
    * @param {object} options
    * @param {Cartesian3} options.position - 坐标数组
    * @param {Entity} options.entity - 实体对象
    * @param {number} options.maxHeiht - 最大高度
    * @param {number} options.minHeiht - 最小高度
    * @param {Array<Cartesian3>} options.startPos - 原始位置
    * @param {number} options.speed - 速度
    * @returns {Array<Cartesian3>} - 实时位置
    */
    setGraphicsFloat(options) {
        if (options && options.entity && options.maxHeiht) {
            try {
                let entity = options.entity,
                    minHeiht = options.minHeiht || 5,
                    maxHeiht = options.maxHeiht || 100,
                    startPos = options.startPos,
                    speed = options.speed || 0.06

                if (startPos.length >= 1) {
                    let flag = false,//控制上升还是下降
                        bg_minHeiht = minHeiht,
                        $this = this

                    entity.positions = new Cesium.CallbackProperty(function () {
                        let positions = $this.transformCartesianToWGS84(startPos)

                        for (let i in positions) {
                            let position = positions[i]
                            // 浮动转换条件
                            if (minHeiht >= maxHeiht || minHeiht <= bg_minHeiht) {
                                flag = !flag
                            }
                            flag ? (minHeiht -= speed) : (minHeiht += speed)
                            position.alt = minHeiht
                        }

                        return $this.transformWGS84ToCartesian(positions)
                    }, false)
                } else console.log('Invalid startPos')
            } catch (error) {
                console.log('Graphics floating failed', error)
            }
        }
    }

    /**
   * 将Cartesian3位置转换为WGS84坐标
   * 可以输入数组
   * @function
   * @param {Array|Cesium.Cartesian3} cartesianPosition - Cartesian3位置
   * @returns {Array|Cesium.Cartesian3} WGS84坐标
   */
    transformCartesianToWGS84(cartesianPosition) {
        if (!Array.isArray(cartesianPosition))
            return CoordTransformer.transformCartesianToWGS84(cartesianPosition);
        else {
            let result = []
            cartesianPosition.forEach(cartesian => result.push(this.transformCartesianToWGS84(cartesian)))
            return result
        }
    }

    /**
    * 将WGS84坐标转换Cartesian3位置
    * 可以输入数组
    * @function
    * @param {Array|Cesium.Cartesian3} wgs84Position - WGS84坐标
    * @returns {Array|Cesium.Cartesian3} Cartesian3位置
    */
    transformWGS84ToCartesian(wgs84Position) {
        if (!Array.isArray(wgs84Position))
            return CoordTransformer.transformWGS84ToCartesian(wgs84Position);
        else {
            let result = []
            wgs84Position.forEach(wgs84 => result.push(this.transformWGS84ToCartesian(wgs84)))
            return result
        }
    }


    // 基本绘图功能
    /**
     * Draws a point on the map at the clicked location.
     *
     * @param {Object} [option] - An optional object to customize the point's appearance.
     * @param {Number} [option.pixelSize=10] - The size of the point in pixels.
     * @param {Cesium.Color} [option.color=Cesium.Color.RED] - The color of the point.
     * @param {Cesium.Color} [option.outlineColor=Cesium.Color.BLACK] - The color of the point's outline.
     * @param {Number} [option.outlineWidth=1] - The width of the point's outline in pixels.
     * @param {Cesium.HeightReference} [option.heightReference=Cesium.HeightReference.CLAMP_TO_GROUND] - The height reference of the point.
     * @param {Number} [option.disableDepthTestDistance=Number.POSITIVE_INFINITY] - The distance from the camera at which to disable the depth test to, for example, avoid z-fighting.
     * @param {Cesium.NearFarScalar} [option.scaleByDistance] - A NearFarScalar object that determines how the point's size scales with distance from the camera.
     * @param {Cesium.NearFarScalar} [option.translucencyByDistance] - A NearFarScalar object that determines how the point's translucency changes with distance from the camera.
     * @param {Cesium.DistanceDisplayCondition} [option.distanceDisplayCondition] - A DistanceDisplayCondition object that determines if the point is displayed.
     *
     * @returns {undefined}
     */
    drawPoint(option = {}) {
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

        const defaultOptions = {
            pixelSize: 10,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: undefined,
            translucencyByDistance: undefined,
            distanceDisplayCondition: undefined
        };

        const opt = Object.assign(defaultOptions, option);

        handler.setInputAction((event) => {
            const earthPosition = this.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                this.viewer.entities.add({
                    position: earthPosition,
                    point: {
                        pixelSize: opt.pixelSize,
                        color: opt.color,
                        outlineColor: opt.outlineColor,
                        outlineWidth: opt.outlineWidth,
                        heightReference: opt.heightReference,
                        disableDepthTestDistance: opt.disableDepthTestDistance,
                        scaleByDistance: opt.scaleByDistance,
                        translucencyByDistance: opt.translucencyByDistance,
                        distanceDisplayCondition: opt.distanceDisplayCondition
                    }
                });
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    /**
    * Adds a label with distance information at the given position.
    *
    * @param {Cartesian3} position - The position where the label should be added.
    */
    addInfoPoint(position) {
        let _labelEntity = new Cesium.Entity();
        _labelEntity.position = position;
        _labelEntity.point = {
            pixelSize: 10,
            outlineColor: Cesium.Color.BLUE,
            outlineWidth: 5,
        };
        _labelEntity.label = {
            text:
                (this.getPositionDistance(this.transformCartesianToWGS84(positions)) / 1000).toFixed(4) + "公里",
            show: true,
            showBackground: true,
            font: "14px monospace",
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(-20, -80), //left top
        };
        this._drawLayer.entities.add(_labelEntity);
    };

    /**
     * Draws a line on the map at the clicked locations.
     *
     * @param {Object} [option] - An optional object to customize the line's appearance.
     * @param {Number} [option.width=5] - The width of the line in pixels.
     * @param {Cesium.MaterialProperty} [option.material=Cesium.Color.RED] - The material of the line.
     * @param {Boolean} [option.clampToGround=true] - Whether the line should be clamped to the ground.
     *
     * @returns {undefined}
     */
    drawLine(option = {}) {
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        let activeShapePoints = [];
        let activeShape = null;
        let floatingPoint = null;

        const defaultOptions = {
            width: 5,
            material: Cesium.Color.RED,
            clampToGround: true,
        };

        const opt = Object.assign(defaultOptions, option);

        handler.setInputAction((event) => {
            const earthPosition = this.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                if (activeShapePoints.length === 0) {
                    floatingPoint = this.viewer.entities.add({
                        position: earthPosition,
                        point: {
                            pixelSize: 5,
                            color: Cesium.Color.YELLOW,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                        }
                    });
                    activeShapePoints.push(earthPosition);
                    const dynamicPositions = new Cesium.CallbackProperty(() => {
                        return activeShapePoints;
                    }, false);
                    activeShape = this.viewer.entities.add({
                        polyline: {
                            positions: dynamicPositions,
                            width: opt.width,
                            material: opt.material,
                            clampToGround: opt.clampToGround
                        }
                    });
                }
                activeShapePoints.push(earthPosition);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction((event) => {
            if (Cesium.defined(floatingPoint)) {
                const newPosition = this.viewer.scene.pickPosition(event.endPosition);
                if (Cesium.defined(newPosition)) {
                    floatingPoint.position = newPosition;
                    activeShapePoints.pop();
                    activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(() => {
            if (Cesium.defined(activeShape)) {
                this.viewer.entities.remove(floatingPoint);
                this.viewer.entities.remove(activeShape);
                this.drawLineShape(activeShapePoints, opt);
                activeShapePoints = [];
                activeShape = null;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }


    /**
     * Draws a polygon on the map at the clicked locations.
     *
     * @param {Object} [option] - An optional object to customize the polygon's appearance.
     * @param {Cesium.MaterialProperty} [option.material=new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.7))] - The material of the polygon.
     * @param {Cesium.HeightReference} [option.heightReference=Cesium.HeightReference.CLAMP_TO_GROUND] - The height reference of the polygon.
     *
     * @returns {undefined}
     */
    drawPolygon(option = {}) {
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        let activeShapePoints = [];
        let activeShape = null;
        let floatingPoint = null;

        const defaultOptions = {
            material: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.7)),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        };

        const opt = Object.assign(defaultOptions, option);

        handler.setInputAction((event) => {
            const earthPosition = this.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                if (activeShapePoints.length === 0) {
                    floatingPoint = this.viewer.entities.add({
                        position: earthPosition,
                        point: {
                            pixelSize: 5,
                            color: Cesium.Color.RED,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                        }
                    });
                    activeShapePoints.push(earthPosition);
                    const dynamicPositions = new Cesium.CallbackProperty(() => {
                        return new Cesium.PolygonHierarchy(activeShapePoints);
                    }, false);
                    activeShape = this.viewer.entities.add({
                        polygon: {
                            hierarchy: dynamicPositions,
                            material: opt.material,
                            heightReference: opt.heightReference
                        }
                    });
                }
                activeShapePoints.push(earthPosition);
                this.viewer.entities.add({
                    position: earthPosition,
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction((event) => {
            if (Cesium.defined(floatingPoint)) {
                const newPosition = this.viewer.scene.pickPosition(event.endPosition);
                if (Cesium.defined(newPosition)) {
                    floatingPoint.position = newPosition;
                    activeShapePoints.pop();
                    activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(() => {
            if (Cesium.defined(activeShape)) {
                this.viewer.entities.remove(floatingPoint);
                this.viewer.entities.remove(activeShape);
                this.drawPolygonShape(activeShapePoints, opt);
                activeShapePoints = [];
                activeShape = null;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

    drawCircle(option = {}) {
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        let center = null;
        let radius = null;
        let floatingPoint = null;

        const defaultOptions = {
            material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.5)),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        };

        const opt = Object.assign(defaultOptions, option);

        handler.setInputAction((event) => {
            const earthPosition = this.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                if (!center) {
                    center = earthPosition;
                    floatingPoint = this.viewer.entities.add({
                        position: center,
                        point: {
                            pixelSize: 5,
                            color: Cesium.Color.RED,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                        }
                    });
                } else if (!radius) {
                    radius = Cesium.Cartesian3.distance(center, earthPosition);
                    this.viewer.entities.remove(floatingPoint);
                    this.viewer.entities.add({
                        position: center,
                        ellipse: {
                            semiMinorAxis: radius,
                            semiMajorAxis: radius,
                            material: opt.material,
                            heightReference: opt.heightReference
                        }
                    });
                    center = null;
                    radius = null;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction((event) => {
            if (Cesium.defined(center) && !radius) {
                const newPosition = this.viewer.scene.pickPosition(event.endPosition);
                if (Cesium.defined(newPosition)) {
                    const newRadius = Cesium.Cartesian3.distance(center, newPosition);
                    floatingPoint.position = newPosition;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    drawLineShape(positions, options) {
        return this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: options.width,
                material: options.material,
                clampToGround: options.clampToGround
            }
        });
    }

    drawPolygonShape(positions, options) {
        return this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(positions),
                material: options.material,
                heightReference: options.heightReference
            }
        });
    }
}
export default DrawingManager;

//// Usage
// const viewer = new Cesium.Viewer('cesiumContainer');
// const drawingManager = new DrawingManager(viewer);

// // Drawing a point
// drawingManager.drawPoint({
//     pixelSize: 15,
//     color: Cesium.Color.BLUE,
//     outlineColor: Cesium.Color.YELLOW,
//     outlineWidth: 2
// });

// // Drawing a line
// drawingManager.drawLine({
//     width: 8,
//     material: Cesium.Color.GREEN,
//     clampToGround: true
// });

// // Drawing a polygon
// drawingManager.drawPolygon({
//     material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.7)),
//     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
// });

// // Drawing a circle
// drawingManager.drawCircle({
//     material: new Cesium.ColorMaterialProperty(Cesium.Color.GREEN.withAlpha(0.5)),
//     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
// });
