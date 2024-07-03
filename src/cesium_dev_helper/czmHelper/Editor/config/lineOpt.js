import * as Cesium from "cesium";

const lineOpt0 = {
    oid: Date.now(),  //原始id
    positions: [],  //坐标数组需要交互时添加
    name: 'test-line' + Date.now(), //图形名称
    material: Cesium.Color.RED,  //配置线段材质
    width: 10,  //线宽
    clampToGround: true,  //是否贴地
    measure: true, //开启测量
    straight: true, //直线模式
    scaleByDistance: new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e7, 0.5),//缩放
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e7),//可视距离
    //
    callback: (_, o) => {
        console.log(o, 'polyline')
    },
}
export {
    lineOpt0,
}


