import * as Cesium from "cesium";

const lineOpt = {

    t_id: Date.now(),  //timestamp as t_id
    name: 'test-line', //图形名称

    positions: [],  //坐标数组需要交互时添加
    material: Cesium.Color.RED,  //配置线段材质
    width: 2,  //线宽
    clampToGround: true,  //是否贴地?
    measure: true, //开启测量?
    mode: 'default',
    scaleByDistance: new Cesium.NearFarScalar(1.5e2/*150m*/, 2.0, 1.5e7, 0.5),//缩放
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e7),//可视距离
    //绘制结束后
    after: ({ entity, value, screenXY, cartoXY }) => {}

}
export {
    lineOpt,
}


