import * as Cesium from 'cesium';
import { add_ConeGlowBottomCircle, add_wallMaterial } from '../Custom/Materials/list';

class EffectController {
    constructor(viewer) {
        this.viewer = viewer;
        this.scene = viewer.scene;
        this.camera = viewer.camera;
    }

    /**
      * Adds a single circle ripple effect to the viewer.
      *
      * @param {Cesium.Cartesian3} position - The position where the ripple will appear.
      * @param {Cesium.MaterialProperty} [material] - The material to use for the ripple. If not provided, a default gradient white material will be used.
      *
      * @returns {undefined}
      */
    addSingleCircleRipple(position, material) {
        const startTime = Cesium.JulianDate.now();
        const duration = 2000; // Duration of the ripple effect in milliseconds
        // 默认材料是一个渐变淡白色椭圆
        function getMaterial() {
            return new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty((time) => {
                const elapsedTime = Cesium.JulianDate.secondsDifference(time, startTime);
                const alpha = 1.0 - (elapsedTime / duration); // Fade out over time
                return Cesium.Color.WHITE.withAlpha(alpha);
            }, false));

        }
        const _material = material || getMaterial();

        const rippleEntity = this.viewer.entities.add({
            position: position,
            ellipse: {
                semiMajorAxis: new Cesium.CallbackProperty(function (time) {
                    const elapsedTime = Cesium.JulianDate.secondsDifference(time, startTime);
                    //  一个周期内 长轴半径随时间增大
                    const radius = (elapsedTime / duration) * 500.0; // Adjust the ripple size
                    return radius;
                }, false),
                semiMinorAxis: new Cesium.CallbackProperty(function (time) {
                    const elapsedTime = Cesium.JulianDate.secondsDifference(time, startTime);
                    const radius = (elapsedTime / duration) * 500.0; // Adjust the ripple size
                    return radius;
                }, false),
                material: _material,
            },
        });

        setTimeout(() => {
            viewer.entities.remove(rippleEntity);
        }, duration);
    }

    /**
     * 创建两个圆扩散纹理效果
     * @param {Object} data - 参数对象
     * @param {number} data.deviationR - 半径增长速度（每帧增长量）
     * @param {number} data.eachInterval - 两个圆的运行时间间隔
     * @param {number} data.maxR - 两个圆的最大半径
     * @param {string} data.imageUrl - 两个圆的图片地址
     * @param {Array} data.position - 两个圆的中心位置
     */
    addDoubleCircleRipple(data) {
        // 根据不同类的圆生成不同的动态颜色
        function getColor(circleType) {
            return new Cesium.CallbackProperty(() => {
                let alpha = 1.0
                if (circleType === 'first') { alpha = 1 - r1 / data.maxR; }
                else if (circleType === 'last') { alpha = 1 - r2 / data.maxR; }
                return Cesium.Color.WHITE.withAlpha(alpha)
            }, false);
        };
        // 默认材质是一个渐变淡白色椭圆
        function getMaterial(circleType) {
            if (data.imageUrl) {
                return new Cesium.ImageMaterialProperty({
                    image: data.imageUrl || '',
                    repeat: Cesium.Cartesian2(1.0, 1.0),  //指定图像在每个方向上重复的次数,默认为Cesium.Cartesian2(1.0, 1.0)
                    color: getColor(circleType)
                })
            } else {
                return new Cesium.ColorMaterialProperty(getColor(circleType));
            };
        }

        // 两个椭圆的长短抽的周期控制
        let r1 = 0, r2 = 0; var r3 = 0, r4 = 0;
        function changeR(r) { //这是callback，参数不能内传
            r = r + data.deviationR;
            if (r > data.maxR) {
                r = 0;
            }
            return r;
        }
        //添加第一个圆形
        this.viewer.entities.add({
            description: "LIGHT_POINTS",
            position: Cesium.Cartesian3.fromDegrees(data.position[0], data.position[1], 0),
            show: true,
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(changeR(r1), false),
                semiMajorAxis: new Cesium.CallbackProperty(changeR(r2), false),
                height: 10,
                material: getMaterial('first'),
            }
        });
        //固定时间后 添加第二个圆
        setTimeout(function () {
            this.viewer.entities.add({
                description: "LIGHT_POINTS",
                position: Cesium.Cartesian3.fromDegrees(data.position[0], data.position[1], 0),
                show: true,
                ellipse: {
                    semiMinorAxis: new Cesium.CallbackProperty(changeR(r3), false),
                    semiMajorAxis: new Cesium.CallbackProperty(changeR(r4), false),
                    height: 10,
                    material: getMaterial('last'),
                }
            });
        }, data.eachInterval)
    }
}


export default EffectController;