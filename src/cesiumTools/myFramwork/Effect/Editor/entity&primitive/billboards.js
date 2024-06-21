// 站点标牌


// 渲染站点标牌
const billboards = [];
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
        label: name,
        isShow: show,
        color: color,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 20000, 0.4),
        attr: attr,
        type: 'marker'
    };
    
    const billControler = new SimpleLabel(
        viewer,
        billboardOpt,
    );
    await billControler.addLabel();

    const target = {
        billControler,
        billboard: billControler.vmInstance.el,
        name
    };
    isCache && billboards.push(target);
    return target;
};