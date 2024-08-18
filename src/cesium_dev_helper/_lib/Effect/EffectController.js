import * as Cesium from 'cesium';
import { CoordTransformer } from '../Compute';
import { RippleCircles, BlinkCircle, singleRippleCircle } from '../Editor/pencil/entities/advanced'

class EffectController {
    constructor(viewer) {
        this.viewer = viewer;
        this.scene = viewer.scene;
        this.camera = viewer.camera;
    }
    // private方法--------------------------------------------------------
    // Cartesian3 WGS84坐标  可以输入数
    _transformCartesianToWGS84(cartesianPosition) {
        return CoordTransformer.transformCartesian3ToCartographic(cartesianPosition);
    }
    _transformWGS84ToCartesian(wgs84Position) {
        return CoordTransformer.transformCartographicToCartesian3(wgs84Position);
    }
    // 更新特效实体属性
    _updateEffectEntity(entity, newOptions) {
        Object.assign(entity, newOptions);
    }
    // 启用特效
    _enableEffect(entity) {
        entity.show = true;
    }

    // 禁用特效
    _disableEffect(entity) {
        entity.show = false;
    }

    // ----------------------------------------------------------------
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
        const wgs84Position = this._transformCartesianToWGS84(position);

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
                        let positions = $this._transformCartesianToWGS84(startPos)

                        for (let i in positions) {
                            let position = positions[i]
                            // 浮动转换条件
                            if (minHeiht >= maxHeiht || minHeiht <= bg_minHeiht) {
                                flag = !flag
                            }
                            flag ? (minHeiht -= speed) : (minHeiht += speed)
                            position.alt = minHeiht
                        }

                        return $this._transformWGS84ToCartesian(positions)
                    }, false)
                } else console.log('Invalid startPos')
            } catch (error) {
                console.log('EntityMaker floating failed', error)
            }
        }
    }

    // 核心💫-----------------------------------------------------------
    // -添加预设特效 
    addPresetEffect(effectType, options) {
        const type = effectType.toLowerCase()
        switch (type) {
            case 'rippleCircles':
                return RippleCircles(options);
            case 'blinkcircle':
                return BlinkCircle(options);
            case 'singleRippleCircle':
                return singleRippleCircle(options);
            // 可以添加更多的预设特效
            default:
                console.warn('Unknown effect type:', effectType);
                return null;
        }
    }
    // -监听
    // 监听实体事件
    addEffectListener(entity, eventType, callback) {
        /*...*/
    }
}


export default EffectController;