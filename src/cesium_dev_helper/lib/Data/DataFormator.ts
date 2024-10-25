import * as Cesium from 'cesium';
import { GeoJSONFeature } from '../../type';
/**
 * Convert a Cesium entity to GeoJSON
 * @param entity - The Cesium Entity
 * @returns GeoJSON feature
 */
export default class DataFormator {
  static cesiumEntityToGeoJSON(entity: Cesium.Entity): GeoJSONFeature {
    // Placeholder for GeoJSON feature
    let geojsonFeature = {
      type: 'Feature' as const,
      geometry: {
        type: '',
        coordinates: [],
      },
      properties: {},
    };

    // Extract entity properties (name, description, etc.) as GeoJSON properties
    geojsonFeature.properties = {
      name: entity.name || '',
      description: entity.description?.getValue(Cesium.JulianDate.now()) || '',
    };

    // Process different geometry types in the Cesium entity
    if (entity.position) {
      // Point
      const cartesian = entity.position.getValue(Cesium.JulianDate.now());
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      geojsonFeature.geometry.type = 'Point';
      geojsonFeature.geometry.coordinates = [
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude),
        cartographic.height || 0,
      ];
    } else if (entity.polyline) {
      // LineString
      const positions = entity.polyline.positions.getValue(
        Cesium.JulianDate.now()
      );
      geojsonFeature.geometry.type = 'LineString';
      geojsonFeature.geometry.coordinates = positions.map(
        (cartesian: Cesium.Cartesian3) => {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          return [
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
            cartographic.height || 0,
          ];
        }
      );
    } else if (entity.polygon) {
      // Polygon
      const hierarchy = entity.polygon.hierarchy.getValue(
        Cesium.JulianDate.now()
      );
      geojsonFeature.geometry.type = 'Polygon';
      geojsonFeature.geometry.coordinates = [
        hierarchy.positions.map((cartesian: Cesium.Cartesian3) => {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          return [
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
            cartographic.height || 0,
          ];
        }),
      ];
    }

    return geojsonFeature;
  }
  static sureCartesin3(position:any){
    let _position:Cesium.Cartesian3;
    if (position instanceof Cesium.Cartographic) {
        const { longitude, latitude, height } = position;
        _position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
      } else if (position instanceof Cesium.Cartesian3) {
        _position = position;
      }
      return _position;
  }
}
