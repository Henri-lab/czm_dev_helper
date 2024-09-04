// 可以控制ripple的数量
import * as Cesium from "cesium";

/**
 * This function creates a series of ripple circles on a 3D globe.
 *
 * @param {Object} extraOption - Additional options for the entities.
 * @param {Object} options - Options for the ripple circles.
 * @param {Cesium.DataSource} datasource - The datasource to add the entities to.
 *
 * @returns {undefined} This function does not return anything.
 */
export default function RippleCircles(extraOption, options, datasource) {
    // 添加任意数量的圆
    for (let i = 0; i < options.circleCount; i++) {
        const delay = i * options.eachInterval;
        const circleType = `circle${i}`;
        const r = i * (options.maxR / options.circleCount);
        addCircle(delay, circleType, r);
    }
}
// 核心💫
const addCircle = (delay, circleType, r) => {
    setTimeout(() => {
        datasource.entities.add({
            ...extraOption,
            description: "ripple-circle",
            position: Cesium.Cartesian3.fromDegrees(options.positions[0], options.positions[1], 0),
            show: true,
            ellipse: {
                semiMinorAxis: changeR(r),
                semiMajorAxis: changeR(r),
                height: 10,
                material: getMaterial(circleType, r),
            }
        });
    }, delay);
};

// 根据相应条件收集需要的属性值--------------------------------------------
// -根据不同类的圆生成不同的动态颜色
function getColor(circleType, r) {
    return new Cesium.CallbackProperty(() => {
        let alpha = 1.0;
        alpha = 1 - r / options.maxR;
        return Cesium.Color.WHITE.withAlpha(alpha);
    }, false);
}

// -纹理材质
function getMaterial(circleType, r) {
    if (options.imageUrl) {
        return new Cesium.ImageMaterialProperty({
            image: options.imageUrl || '',
            repeat: Cesium.Cartesian2(1.0, 1.0), //指定图像在每个方向上重复的次数,默认为Cesium.Cartesian2(1.0, 1.0)
            color: getColor(circleType, r)
        });
    } else {
        return new Cesium.ColorMaterialProperty(getColor(circleType, r));
    }
}

// -椭圆的长短轴的周期控制
function changeR(r) { //这是callback，参数不能内传
    return new Cesium.CallbackProperty(() => {
        r += options.deviationR;
        if (r > options.maxR) {
            r = 0;
        }
        return r;
    }, false);
}


// const opt = {
//     position: [114.305, 30.592], // 中心点的经纬度
//     maxR: 1000, // 最大半径
//     deviationR: 10, // 每次增加的半径
//     eachInterval: 1000, // 每个圆的时间间隔
//     circleCount: 5, // 圆的数量
//     imageUrl: 'path/to/your/image.png' // 可选的图像路径
// };



// 优点：
// 灵活性高：可以添加任意数量的圆形波纹，只需更改 data.circleCount 即可。
// 颜色和透明度动态变化：每个圆的颜色和透明度根据半径动态调整，视觉效果丰富。
// 周期性变化：通过 Cesium.CallbackProperty 实现半径和旋转角度的周期性变化，动态效果明显。
// 多样化材质支持：支持使用图片材质或颜色材质。
// 缺点：
// 复杂度高：代码逻辑较为复杂，特别是回调函数和动态属性的管理。
// 可能性能开销较大：如果圆的数量较多，频繁的属性更新可能会对性能产生影响。