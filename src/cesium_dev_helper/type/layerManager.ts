import * as Cesium from 'cesium';
import ImageryLayer from 'cesium/Source/Scene/ImageryLayer';
import Entity from 'cesium/Source/DataSources/Entity';
import DataSource from 'cesium/Source/DataSources/DataSource';

export type Viewer = Cesium.Viewer;
export type LayerManager = LayerManagerClass;

export interface LayerManagerClass {
  // 定义只读属性
  readonly viewer: Cesium.Viewer;
  layers: ImageryLayer[];
  // constructor:new (viewer: Viewer) => LayerManagerClass;
  addLayer: (layer: ImageryLayer) => void;
  removeLayer: (layer: ImageryLayer) => void;
  showLayer: (layer: ImageryLayer) => void;
  hideLayer: (layer: ImageryLayer) => void;
  getOrCreateDatasourceByName: (name: String) => DataSource;
  getDatasourceByName: (name: String) => String;
  // getOwnerOfEntity: (entity:Entity) => ImageryLayer;//this method is static
}
