const providerTypes = [
    'ArcGisMapServerImageryProvider',
    'ArcGISTiledElevationTerrainProvider',
    'BingMapsImageryProvider',
    'Cesium3DTilesVoxelProvider',//
    'CesiumTerrainProvider',
    'CustomHeightmapTerrainProvider',
    'EllipsoidTerrainProvider',
    'GoogleEarthEnterpriseImageryProvider',
    'GoogleEarthEnterpriseMapsProvider',//
    'GoogleEarthEnterpriseTerrainProvider',
    'GridImageryProvider',
    'I3SDataProvider',//
    'ImageryProvider',
    'IonImageryProvider',
    'MapboxImageryProvider',
    'MapboxStyleImageryProvider',
    'OpenStreetMapImageryProvider',
    'SingleTileImageryProvider',
    'TerrainProvider',
    'TileCoordinatesImageryProvider',
    'TileMapServiceImageryProvider',
    'TileProviderError',//
    'UrlTemplateImageryProvider',
    'VoxelProvider',//
    'VRTheWorldTerrainProvider',
    'WebMapServiceImageryProvider',
    'WebMapTileServiceImageryProvider'
];

const terrainProviderTypes = [
    'CesiumTerrainProvider', // 使用 Cesium Ion 的地形提供者
    'EllipsoidTerrainProvider', // 使用椭球模型的地形提供者
    'VRTheWorldTerrainProvider', // 使用 VR-TheWorld 的地形提供者
    'GoogleEarthEnterpriseTerrainProvider', // 使用 Google Earth 企业版的地形提供者
    'ArcGISTiledElevationTerrainProvider', // 使用 ArcGIS 瓦片高程地形提供者
    'CustomHeightmapTerrainProvider', // 使用自定义高程图的地形提供者
];

const imageryProviderTypes = [
    'ArcGisMapServerImageryProvider', // 使用 ArcGIS Map Server 的影像图层提供者
    'BingMapsImageryProvider', // 使用 Bing Maps 的影像图层提供者
    'GoogleEarthEnterpriseImageryProvider', // 使用 Google Earth 企业版的影像图层提供者
    'GridImageryProvider', // 使用网格影像图层提供者
    'IonImageryProvider', // 使用 Cesium Ion 的影像图层提供者
    'MapboxImageryProvider', // 使用 Mapbox 的影像图层提供者
    'MapboxStyleImageryProvider', // 使用 Mapbox 风格的影像图层提供者
    'OpenStreetMapImageryProvider', // 使用 OpenStreetMap 的影像图层提供者
    'SingleTileImageryProvider', // 使用单个瓦片影像图层提供者
    'TileCoordinatesImageryProvider', // 使用瓦片坐标影像图层提供者
    'TileMapServiceImageryProvider', // 使用瓦片地图服务影像图层提供者
    'UrlTemplateImageryProvider', // 使用 URL 模板影像图层提供者
    'WebMapServiceImageryProvider', // 使用 Web Map Service (WMS) 的影像图层提供者
    'WebMapTileServiceImageryProvider', // 使用 Web Map Tile Service (WMTS) 的影像图层提供者
];


const viewerProperties = [
    'animation',
    'baseLayerPicker',
    'cesiumWidget',
    'clock',
    'container',
    'creditContainer',
    'creditViewport',
    'dataSources',
    'fullscreenButton',
    'fullscreenElement',
    'geocoder',
    'homeButton',
    'imageryLayers',
    'infoBox',
    'navigationHelpButton',
    'projectionPicker',
    'scene',
    'sceneModePicker',
    'screenSpaceEventHandler',
    'selectionIndicator',
    'shadowMap',
    'targetFrameRate',
    'terrainProvider',
    'timeline',
    'trackedEntity',
    'tracking',
    'useDefaultRenderLoop',
    'viewerContainer',
    'vrButton'
];


export {
    providerTypes,
    terrainProviderTypes,
    imageryProviderTypes,
    viewerProperties,
}