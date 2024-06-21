import MaterialCreator from "../../MaterialCreator";
// 重保活动圆柱
// 材质是自定义WallGradientsMaterialProperty




// options: {
//   position: {lng,lat,height},
//   height: 1000,
//   baseHeight: 0, // 圆柱底部高度
//   radius: 100, // 圆柱半径
//   color: "#ff0000", // 圆柱颜色
//   name: "活动圆柱" // 圆柱名称
// }
let cones = [];
export const addGradientCone = (viewer, options) => {
    // 圆柱颜色
    const wallColor = Cesium.defaultValue(
        new Cesium.Color.fromCssColorString(options.color),
        Cesium.Color.AQUA
    );
    const name = Cesium.defaultValue(options.name, "");
    // 坐标中心，经纬度
    const center = Cesium.defaultValue(options.position, {
        lng: 0,
        lat: 0,
        height: 0,
    });
    const wallHeight = Cesium.defaultValue(options.height, 2600);
    const baseHeight = Cesium.defaultValue(options.baseHeight, 0);
    const radius = Cesium.defaultValue(options.radius, 200);
    const positions = generateCirclePoints([center.lng, center.lat], radius, baseHeight);
    // 将经纬度转为笛卡尔3
    const wallPositions = pointsToPositions(positions, baseHeight);
    let minimumHeights = []; //最小高度集合
    let maximumHeights = []; //最大高度集合
    wallPositions.forEach((position) => {
        minimumHeights.push(baseHeight);
        maximumHeights.push(baseHeight + wallHeight);
    });

    const cone = viewer.entities.add({
        name,
        center: new Cesium.Cartesian3.fromDegrees(
            center.lng,
            center.lat,
            baseHeight
        ),
        wall: {
            positions: wallPositions,
            minimumHeights: minimumHeights,
            maximumHeights: maximumHeights,
            material: new MaterialCreator().wallMaterial(wallColor),
        },
    });
    cones.push(cone);
};

// 删除所有圆柱
export const removeAllCones = (viewer) => {
    cones.forEach((cone) => {
        cone && viewer.entities.remove(cone);
    });
    cones.length = 0;
};

// 视角飞到圆柱
export const flyToCone = (viewer, name) => {
    const targetCone = cones.find((item) => item.name === name);

    if (!targetCone) {
        return;
    }
    viewer.flyTo(targetCone, {
        offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40), Cesium.Math.toRadians(-40), 5000)
    });
};