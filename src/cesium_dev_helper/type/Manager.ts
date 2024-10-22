import * as Cesium from 'cesium';
import ImageryLayer from 'cesium/Source/Scene/ImageryLayer';
import Entity from 'cesium/Source/DataSources/Entity';
import DataSource from 'cesium/Source/DataSources/DataSource';

export interface LayerManagerClass {
  addLayer: (layer: ImageryLayer) => void;
  removeLayer: (layer: ImageryLayer) => void;
  showLayer: (layer: ImageryLayer) => void;
  hideLayer: (layer: ImageryLayer) => void;
  getOrCreateDatasourceByName: (name: String) => DataSource;
  getDatasourceByName: (name: String) => String;
  getOwnerOfEntity: (entity:Entity) => ImageryLayer;//this method is static
}
export interface EventManagerClass {
  _addEvent(eventType: any, callback: any, priority?: number): void;
  onMouseClick(callback: any, priority?: number): void;
  onMouseRightClick(callback: any, priority?: number): void;
  onMouseDoubleClick(callback: any, priority?: number): void;
  onMouseDown(callback: any, priority?: number): void;
  onMouseUp(callback: any, priority?: number): void;
  onMouseMove(callback: any, priority?: number): void;
  onMouseWheel(callback: any, priority?: number): void;
  onKeyDown(callback: any, priority?: number): void;
  onKeyUp(callback: any, priority?: number): void;
  removeEventListener(callback: any): void;
  clear(): void;
  destroy(): void;
}
