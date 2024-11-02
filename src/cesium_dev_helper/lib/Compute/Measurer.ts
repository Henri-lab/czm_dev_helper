import * as Cesium from 'cesium';
import TurfUser from './TurfUser';

export default class Measurer {
  viewer: Cesium.Viewer;
  $turfUser: TurfUser;
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    this.$turfUser = new TurfUser(viewer);
  }

  heightToGround(longitude, latitude, height) {
    // Define the target point with latitude, longitude, and height (Cartesian position)
    const targetPosition = Cesium.Cartographic.fromDegrees(
      longitude,
      latitude,
      height
    );
    // Sample the terrain height at the given latitude and longitude
    Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, [
      targetPosition,
    ]).then(function (samples) {
      const groundHeight = samples[0].height;
      const heightAboveGround = targetPosition.height - groundHeight;
      console.log('Height above ground:', heightAboveGround);
    });
  }
}
