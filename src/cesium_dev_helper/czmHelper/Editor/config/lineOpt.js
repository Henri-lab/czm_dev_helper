import * as Cesium from "cesium";

const lineOpt0 = {
    positions: [],  //坐标数组需要交互时添加
    name: 'test-line' + Date.now(), //图形名称
    oid: Date.now(),  //原始id
    material: Cesium.Color.RED,  //配置线段材质
    width: 3,  //线宽
    clampToGround: true,  //是否贴地
    measure: true, //开启测量
    straight: true, //直线模式
}
export {
    lineOpt0,
}