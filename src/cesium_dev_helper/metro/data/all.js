import { renderLines, removeAllLines, displayLineByName } from "./line";
import { renderStation, removeAllStations, displayStationByName } from "./stations";
import { renderStationBill, removeAllBillboards } from "./billboards";



// 渲染全部
export const renderAll = (viewer, dataSource, isCache = true) => {
    // 渲染道路
    if (dataSource.length) {
        let cacheData = {
            lineEnts: [],
            stationEnts: [],
            billboards: []
        }
        dataSource.forEach((item) => {
            const { paths, name, color, stationsList } = item;
            // 渲染道路线
            const lineEnt = renderLines(viewer, {
                positions: paths,
                color,
                name,
                isCache
            });
            // 不要求缓存的话，就把数据返回
            !isCache && cacheData.lineEnts.push(lineEnt);
            // 渲染站点以及站点标牌
            stationsList.forEach(async (station) => {
                const { position, name } = station;
                const stationEnt = renderStation(viewer, {
                    position,
                    name,
                    color,
                    isCache
                });
                !isCache && cacheData.stationEnts.push(stationEnt);
                const billboard = await renderStationBill(viewer, {
                    position,
                    name,
                    color,
                    attr: station,
                    isCache
                });
                !isCache && cacheData.billboards.push(billboard);
            });
        });
        return cacheData;
    }
};


// 清除全部
// removeAllLines removeAllStations 移除的是实体
// removeAllBillboards 移除的是cesium控件下的html元素
export const removeAll = (viewer) => {
    removeAllLines(viewer);
    removeAllStations(viewer);
    removeAllBillboards()
};


// 通过名称整体控制显示隐藏
export const displayAllByName = (lineNames, stationNames, isShow) => {
    displayLineByName(lineNames, isShow);
    displayStationByName(stationNames, isShow);
};

// 按照缓存数据清除
// cacheData类型 {
//   lineEnts:[],
//   stationEnts:[],
//   billboards:[{
//     popuploder:PopupLoader实例,
//     billboard:Billboard实例
//}]
// }
export const removeByCacheData = (viewer, cacheData) => {
    if (Object.keys(cacheData).length === 0) {
        return
    }
    const { lineEnts, stationEnts, billboards } = cacheData;
    lineEnts.forEach(line => viewer.entities.remove(line))
    stationEnts.forEach(station => {
        const { conePrimitve, bottomCircleEntity } = station;
        viewer.scene.primitives.remove(conePrimitve);
        viewer.entities.remove(bottomCircleEntity);
    })
    billboards.forEach((item) => {
        const { PopupLoder } = item;
        PopupLoder.removeMarker();
        PopupLoder.removeQueryPopup();
    });
}