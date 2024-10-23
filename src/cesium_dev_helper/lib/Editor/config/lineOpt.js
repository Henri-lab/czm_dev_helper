import * as Cesium from "cesium";

const lineOpt = {
    datasource: null,
    created_time: Date.now(),  //timestamp as created_time
    name: 'test-line', //图形名称
    positions: [],   //预坐标
    material: Cesium.Color.RED,  //配置线段材质
    width: 2,  //线宽
    clampToGround: true,  //是否贴地?
    measure: true, //开启测量?
    mode: 'default',
    scaleByDistance: new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e7, 0.5),//缩放
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e7),//可视距离
    //绘制结束后
    after: ({ entity, value, screenXY, cartoXY }) => { }
}
const polygonOpt = {
    datasource: null,
    created_time: Date.now(),
    name: 'test-poly',
    positions: [],
    material: Cesium.Color.BLUE,
    width: 5,
    mode: 'default',
    clampToGround: true,
    measure: true,
    scaleByDistance: new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e7, 0.5),
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e7),
    after: ({ entity, value, screenXY, cartXY }) => {
        measureRes.value = value
        console.log(screenXY, cartXY)
    }
}
export {
    lineOpt,
    polygonOpt
}


