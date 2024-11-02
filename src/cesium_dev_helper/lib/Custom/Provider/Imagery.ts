import * as Cesium from 'cesium';
export default class Imagery {
  constructor() {}

  static getImagery(name: string = 'default', options) {
    switch (name.toLowerCase()) {
      case 'bing':
        return new Cesium.BingMapsImageryProvider({
          url: options.url || 'https://dev.virtualearth.net', // Bing Maps服务URL
          key: options.key || import.meta.env.BingMapKey || 'is a key',
          mapStyle: options.mapStyle || Cesium.BingMapsStyle.AERIAL, // 影像类型（AERIAL为卫星影像）
        });
      case 'osm':
        return new Cesium.OpenStreetMapImageryProvider({
          url: options.url || 'https://a.tile.openstreetmap.org/',
        });

      case 'mapbox':
        return new Cesium.MapboxImageryProvider({
          mapId: options.mapId || 'mapbox.satellite',
          accessToken:
            options.accessToken || import.meta.env.MapboxKey || 'is a token',
        });

      case 'arcgis':
        return new Cesium.ArcGisMapServerImageryProvider({
          url:
            options.url ||
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        });

      case 'ion':
        return new Cesium.IonImageryProvider({
          assetId: options.assetId || 2, // 默认assetId为2（Cesium提供的基础影像图层）
          accessToken:
            options.accessToken ||
            import.meta.env.VITE_CESIUM_KEY ||
            'is a token',
        });

      case 'wmts':
        return new Cesium.WebMapTileServiceImageryProvider({
          url:
            options.url ||
            'https://your-wmts-service-url/{TileMatrix}/{TileRow}/{TileCol}.png',
          layer: options.layer || 'your-layer-name',
          style: options.style || 'default',
          format: options.format || 'image/png',
          tileMatrixSetID: options.tileMatrixSetID || 'default',
          maximumLevel: options.maximumLevel || 18,
        });

      case 'tms':
        return new Cesium.UrlTemplateImageryProvider({
          url: options.url || 'https://your-tms-service-url/{z}/{x}/{y}.png',
          credit: options.credit || 'TMS Provider',
        });

      case 'xyz':
        return new Cesium.UrlTemplateImageryProvider({
          url: options.url || 'https://your-xyz-service-url/{z}/{x}/{y}.png',
          maximumLevel: options.maximumLevel || 19,
          credit: options.credit || 'XYZ Provider',
        });

      default:
        console.warn(`Unsupported imagery provider: ${name}`);
        return null;
    }
  }
}
