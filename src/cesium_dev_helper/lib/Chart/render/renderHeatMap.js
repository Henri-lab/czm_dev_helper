import * as Cesium from "cesium";
import getCesiumHeat from "../type/heatMap";

/**
 * 渲染热力图,传入站点坐标，站点信息，渲染热力图
 * @param {Object} viewer 
 * @param {Array<{lng,lat,value}>} dataSource 
 * @returns {Function} destroyHeat;
 */
export const renderHeatMap = (viewer, dataSource) => {
    // 获得CesiumHeat类
    const CesiumHeat = getCesiumHeat(Cesium);
    let heat = new CesiumHeat(
        viewer,
        {
            autoMaxMin: true,
            // data list, each has x, y, and value | 数据数组，每个包含 x,y,value字段
            data: dataSource,
        },
        // bbox for heatmap | 只在范围内显示热力图拉近会清晰些，默认整个地球但拉近后巨模糊
        [114.03, 30.2, 114.45, 30.9]
    );

    const destroyHeat = () => {
        heat.destory();
    };
    // 将清除方法暴露出去
    return destroyHeat;
};