// 提供最基本的绘画功能
import { CoordTransformer } from "../Compute";
import Manager from "./Manager";
import * as Cesium from "cesium";


// let Cesium = new Manager().Cesium;
class DrawingManager extends Manager {
    constructor(viewer) {
        if (viewer)
            super(viewer);
    }
    /**
    * 创建一个实体
    * 函数名起的不恰当,后续再改
    * @returns {Object} 实体空对象（带签名）
    */
    static createGraphics() {
        let entity = new Cesium.Entity();

        // author sign
        // Object.defineProperty(entity, 'Auther', {
        //     value: 'henriFox',
        //     writable: false,    // 不可写
        //     configurable: false // 不可配置
        // });

        return entity;
    }

    /**
    * 创建一个实体
    * @returns {Object} 实体空对象（带签名）
    */
    MyEntity() {
        let entity = new Cesium.Entity();

        // author sign ~~ czm Entity不接受
        // Object.defineProperty(entity, 'Auther', {
        //     value: 'henriFox',
        //     writable: false,    // 不可写
        //     configurable: false // 不可配置
        // });



        return entity;
    }


    // private方法--------------------------------------------------------
    // Cartesian3 WGS84坐标  可以输入数
    _transformCartesianToWGS84(cartesianPosition) {
        return CoordTransformer.transformCartesian3ToCartographic(cartesianPosition);
    }
    _transformWGS84ToCartesian(wgs84Position) {
        return CoordTransformer.transformCartographicToCartesian3(wgs84Position);
    }
}
export default DrawingManager;





