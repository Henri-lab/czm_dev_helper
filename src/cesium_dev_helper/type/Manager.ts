import * as Cesium from 'cesium';
import * as THREE from 'three';
import ImageryLayer from 'cesium/Source/Scene/ImageryLayer';
import Entity from 'cesium/Source/DataSources/Entity';
import DataSource from 'cesium/Source/DataSources/DataSource';
import { ViewerConfig } from './Config';

export interface I_LayerManagerClass {
  addLayer: (layer: ImageryLayer) => void;
  removeLayer: (layer: ImageryLayer) => void;
  showLayer: (layer: ImageryLayer) => void;
  hideLayer: (layer: ImageryLayer) => void;
  getOrCreateDatasourceByName: (name: String) => DataSource;
  getDatasourceByName: (name: String) => String;
  getOwnerOfEntity: (entity: Entity) => ImageryLayer; //this method is static
}
export interface I_EventManagerClass {
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
export interface I_ConfigManagerClass {
  data: any;
  init_data(): void;
  initViewer(
    config: ViewerConfig,
    all?: boolean
  ): Promise<
    | Cesium.Viewer
    | {
        viewer: Cesium.Viewer;
        render: any;
        scene: Cesium.Scene;
        camera: Cesium.Camera;
      }
  >;
}
export interface I_CameraManager {
  scene: Cesium.Scene;
  camera: Cesium.Camera;
  vehicleEntity: Cesium.Entity | null;
  isFirstPerson: boolean;
  firstPersonOffset: Cesium.Cartesian3;
  animationFrameId: number | null;
  rotatedEarthAngleSum: number;
  _updateFirstPersonView(firstPersonOffset: Cesium.Cartesian3): void;
  zoomIn(): void;
  zoomOut(): void;
  panLeft(distance?: number): void;
  panRight(distance?: number): void;
  panUp(distance?: number): void;
  panDown(distance?: number): void;
  flyTo(options: {
    position: {
      longitude: number;
      latitude: number;
      height: number;
    };
    effectOptions?: {
      duration?: number;
      orientation?: {
        heading?: number;
        pitch?: number;
        roll?: number;
      };
    };
  }): void;
  setView(options: {
    destination:
      | { longitude: number; latitude: number; height: number }
      | Cesium.Cartesian3;
    heading?: number;
    pitch?: number;
    roll?: number;
  }): void;
  setCameraLookAtTransform(
    targetPosition: Cesium.PositionProperty,
    offset?: Cesium.Cartesian3
  ): void;
  setCameraLookAt(
    targetPosition: Cesium.PositionProperty,
    offset?: Cesium.Cartesian3
  ): void;
  resetView(): void;
  getCurrentPosition(): {
    longitude: number;
    latitude: number;
    height: number;
  };
  getCurrentOrientation(): {
    heading: number;
    pitch: number;
    roll: number;
  };
  rotateView(axis?: Cesium.Cartesian3, angle?: number): void;
  switchToFirstPerson(vehicleEntity: Cesium.Entity): void;
  exitFirstPerson(): void;
  isRotationEnabled(flag: boolean, angle?: number, speed?: number): void;
  rotateEarth(angle?: number, speed?: number): void;
  syncWithThree(
    threeCamera:
      | THREE.Camera
      | THREE.PerspectiveCamera
      | THREE.OrthographicCamera,
    czmCamera: Cesium.Camera
  ): void;
}
