import * as Cesium from 'cesium';
export default class Terrain {
  constructor() {}

  static getTerrian(name: string='default') {
    switch (name.toLowerCase()) {
      case 'world':
        return Cesium.createWorldTerrain({
          requestVertexNormals: true, // 开启法线，用于光照效果
          requestWaterMask: true, // 开启水面效果
        });
      default:
        return Cesium.createWorldTerrain({
          requestVertexNormals: true, // 开启法线，用于光照效果
          requestWaterMask: true, // 开启水面效果
        });
    }
  }
}
