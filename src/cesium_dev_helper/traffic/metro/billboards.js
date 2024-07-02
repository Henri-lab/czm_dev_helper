import * as Cesium from "cesium";
import { findStationByName, _PopupLoader } from "./index.js";
// 站点标牌 (billboard) 缩写 bb,BB
//  const bb = {
//         PopupLoader,
//         htmlEle: PopupLoader.vmInstance.el,
//         name
//     };


// 渲染站点标牌
let billboards = [];
export const renderStationBill = async (viewer, options) => {
    const position = Cesium.defaultValue(options.position, {
        lng: 0,
        lat: 0,
    });
    const height = Cesium.defaultValue(options.height, 200);
    const name = Cesium.defaultValue(options.name, "站点");
    const show = Cesium.defaultValue(options.show, true);
    const color = Cesium.defaultValue(options.color, "#ff0000");
    const attr = Cesium.defaultValue(options.attr, {});
    const isCache = Cesium.defaultValue(options.isCache, true);
    const billboardOpt = {
        position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, height),
        label: name, //相当于查找ID
        isShow: show,
        color: color,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 20000, 0.4),
        attr: attr,
        type: 'marker'
    };


    const PopupLoader = new _PopupLoader(
        viewer,
        billboardOpt,
    );
    // 挂载popup
    await PopupLoader.addLabel();

    const target = {
        PopupLoader,
        htmlEle: PopupLoader.vmInstance.el,
        name
    };
    isCache && billboards.push(target);
    return target;
};



// 根据 名称-Array 控制站点标牌显示与隐藏
export const changeDisplayBillBoard = (names, isShow) => {
    // 每个bb都要遍历一次names
    const isThatBBs = billboards.filter(
        (bb) => names.indexOf(bb.PopupLoader.label) > -1
    );
    isThatBBs.forEach((bb) => {
        const { htmlEle, PopupLoader } = bb;
        PopupLoader.isDisplay = isShow;
        htmlEle.style.display = isShow ? "block" : "none";
    });
}


// 清除所有站点标牌
export const removeAllBillboards = () => {
    billboards.forEach((bb) => {
        const { PopupLoader } = bb;
        PopupLoader.removeMarker();
        PopupLoader.queryPopup && PopupLoader.removeQueryPopup();
    });
};


// 通过名称找到对应的站牌
/**
 * 
 * @param {string} name -站牌名字
 * @param {{billboards:Array}} cacheData -缓存数据 
 * @returns  {Entity}
 */
export const findBillboardByName = (name, cacheData) => {
    let billboardsData = billboards
    // 如果传入缓存数据则使用传入的缓存数据
    if (cacheData) {
        const { billboards } = cacheData
        billboardsData = billboards
    }
    const targetBillboard = billboardsData.find((item) => item.PopupLoader.label === name);
    return targetBillboard;

}


let activeBB/* 展示中的站牌*/
// 输入站点名称 则展示站点的站牌
export const focusOnStation = (viewer, name, cacheData) => {
    const targetBB = findBillboardByName(name, cacheData);
    const { PopupLoader/* 目标站牌的loader*/ } = targetBB;
    const targetSta = findStationByName(name, cacheData);

    // 移除正在展示的查询型popup
    if (activeBB) {
        const { PopupLoader /* 展示中的站牌loader*/ } = activeBB
        PopupLoader.removeQueryPopup()
    }

    // 如果找到了车站+站牌 
    if (targetSta && PopupLoader) {
        const { bottomCircleEntity } = targetSta
        viewer.flyTo(bottomCircleEntity, {
            offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40), Cesium.Math.toRadians(-40), 5000)
        });
        // 挂载目标站牌
        PopupLoader/* 目标站牌的loader*/.showQueryPopup()
        // 注册正在聚焦的站牌
        activeBB = targetBB
    }
}