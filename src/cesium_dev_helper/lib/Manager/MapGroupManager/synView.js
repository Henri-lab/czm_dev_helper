// 拓展功能 
// 同步视图 解决二三维地图的交互冲突
// 同步频率：由于Cesium和OpenLayers的视图更新频率不同，可能会出现性能问题。可以在实际应用中调整同步的触发频率或使用防抖机制。
// 坐标转换：确保Cesium和OpenLayers使用相同的坐标系进行转换和同步。
import * as Cesium from 'cesium'
export function syncCesiumToOL(cesiumViewer, olMap) {
    const scene = cesiumViewer.scene;
    const camera = scene.camera;
    const position = Cesium.Cartographic.fromCartesian(camera.position);

    const longitude = Cesium.Math.toDegrees(position.longitude);
    const latitude = Cesium.Math.toDegrees(position.latitude);
    const height = position.height;

    const olView = olMap.getView();
    const olCenter = ol.proj.fromLonLat([longitude, latitude]);

    olView.setCenter(olCenter);
    olView.setZoom(Math.log2(6378137 / height)); // 简单的高度转缩放级别

    cesiumViewer.camera.changed.addEventListener(syncCesiumToOL);
}

export function syncOLToCesium(olMap, cesiumViewer) {
    const olView = olMap.getView();
    const olCenter = ol.proj.toLonLat(olView.getCenter());
    const zoom = olView.getZoom();
    const height = 6378137 / Math.pow(2, zoom);

    cesiumViewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(olCenter[0], olCenter[1], height)
    });


    olMap.getView().on('change:center', syncOLToCesium);
    olMap.getView().on('change:resolution', syncOLToCesium);
}

