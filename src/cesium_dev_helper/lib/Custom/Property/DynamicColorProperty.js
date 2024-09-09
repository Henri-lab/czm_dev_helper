import * as Cesium from "cesium";

/**
 * 自定义颜色动态属性
 * @param {function} definition - 基于时间生成颜色的回调函数
 */
export default class DynamicColorProperty {
    constructor(definition) {
      
        this._definition = definition;
        this._definitionChanged = new Cesium.Event();
    }

    // 属性是否恒定
    get isConstant() {
        return false;
    }

    // 事件处理
    get definitionChanged() {
        return this._definitionChanged;
    }

    // 获取属性值
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        
        // 使用定义函数计算属性值
        const color=this._definition(time)
        result.color =color;
        // console.log('Calculated color:', color); 
        return color;
    }

    // 属性比较
    equals(other) {
        return this === other ||
            (other instanceof DynamicColorProperty &&
                this._definition === other._definition);
    }
}




// // 创建一个 Cesium Viewer
// const viewer = new Cesium.Viewer('cesiumContainer');

// // 定义动态颜色变化函数
// const colorDefinition = function (time) {
//     const julianDate = Cesium.JulianDate.toDate(time);
//     const seconds = julianDate.getSeconds();
    
//     // 根据时间计算颜色（例如，每秒在红、绿、蓝之间切换）
//     if (seconds % 3 === 0) {
//         return Cesium.Color.RED;
//     } else if (seconds % 3 === 1) {
//         return Cesium.Color.GREEN;
//     } else {
//         return Cesium.Color.BLUE;
//     }
// };

// // 创建一个动态颜色属性
// const dynamicColorProperty = new DynamicColorProperty(colorDefinition);

// // 添加一个带有动态颜色的实体
// const entity = viewer.entities.add({
//     position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
//     point: {
//         pixelSize: 10,
//         color: dynamicColorProperty, // 使用动态颜色属性
//     }
// });

// // 调整相机位置到实体
// viewer.zoomTo(entity);
