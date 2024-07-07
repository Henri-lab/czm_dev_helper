import * as Cesium from 'cesium';
import { get_ConeGlowBottomCircle, get_wallGradients } from '../Custom/Materials/list';

class EffectController {
    constructor(viewer) {
        this.viewer = viewer;
        this.scene = viewer.scene;
        this.camera = viewer.camera;
    }


    
   
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