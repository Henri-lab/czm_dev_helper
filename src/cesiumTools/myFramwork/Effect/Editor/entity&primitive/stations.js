// metro stations的增删改查
// 光柱特效

import GeometryCreater from '../../GeometryCreater'
import EffectController from '../../EffectController';



const stations = [];

// 渲染站点
export const renderStation = (viewer, options) => {
    const name = Cesium.defaultValue(options.name, "站点");
    const position = Cesium.defaultValue(options.position, {
        lng: 0,
        lat: 0,
    });
    const positionCar3 = Cesium.Cartesian3.fromDegrees(
        position.lng,
        position.lat
    );
    // 光柱效果
    const lightConeopt = {
        position: positionCar3,
        height: options.height || 300,
        bottomRadius: options.bottomRadius || 30,
        color: Cesium.Color.fromCssColorString(options.color),
    }
    const conePrimitve = new GeometryCreater(viewer).lightCone(lightConeopt);
    conePrimitve.name = name
    const bottomCircleOpt = {
        position: positionCar3,
        bottomRadius: 30,
        color: Cesium.Color.fromCssColorString(options.color),
    }
    // 光柱底部圆形渐变
    const bottomCircleEntity = new EffectController(viewer).addConeGlowBottomCircle(bottomCircleOpt);
    bottomCircleEntity.name = name
    // 缓存站点
    const isCache = Cesium.defaultValue(options.isCache, true);
    const target = {
        conePrimitve,
        bottomCircleEntity,
        name
    };
    isCache && stations.push(target);
    return target;
};


// 删除站点
// --删除单个站点，直接删除，而不是隐藏
export const removeStationByName = (viewer, name) => {
    const target = stations.find((item) => item.name === name);
    if (target) {
        const { conePrimitve, bottomCircleEntity } = target;
        viewer.scene.primitives.remove(conePrimitve);
        viewer.entities.remove(bottomCircleEntity);
        stations.splice(stations.indexOf(target), 1);
    }
};
// --删除所有站点
export const removeAllStations = (viewer) => {
    stations.forEach((item) => {
        const { conePrimitve, bottomCircleEntity } = item;
        viewer.scene.primitives.remove(conePrimitve);
        viewer.entities.remove(bottomCircleEntity);
    });
    stations.length = 0;
};

// 站点的显示
// 通过名称Array控制站点显示隐藏
export const hideStationByName = (names, isShow) => {
    changeDisplayBillBoard(names, isShow);
    const targets = stations.filter((item) => names.indexOf(item.name) > -1);
    if (targets.length) {
        targets.forEach((target) => {
            const { conePrimitve, bottomCircleEntity } = target;
            conePrimitve.show = isShow;
            bottomCircleEntity.show = isShow;
        });
    }
};