import * as Cesium from 'cesium';
import { I_EventManagerClass, I_LayerManagerClass } from './Manager';
import {
  I_EntityDrawerClass,
  I_ParsedEntityOptions,
  I_EntityOption,
} from './Tool';

export type mapProvider = Cesium.ImageryProvider | Cesium.TerrainProvider;
export type CzmViewer = Cesium.Viewer;
export type LayerManager = I_LayerManagerClass;
export type EventManager = I_EventManagerClass;
export type OrderedCallback = {
  callback: Function | KeyboardEventFunction;
  priority: number;
};
export type HandlerEventType =
  | Cesium.ScreenSpaceEventHandler.PositionedEvent
  | Cesium.ScreenSpaceEventHandler.MotionEvent
  | Cesium.ScreenSpaceEventHandler.TwoPointEvent
  | Cesium.ScreenSpaceEventHandler.TwoPointMotionEvent
  | { delta: number };
export type EditorPluginFunction = (
  entity: Cesium.Entity,
  cartesian3s: Cesium.Cartesian3[]
) => void;
export type HandlePickedFunction = (
  event: HandlerEventType,
  pickedPos: Cesium.Cartesian3,
  pickedObj: Cesium.Entity | Cesium.Primitive
) => any;
export type KeyboardEventFunction = (...args: any[]) => any;
export type ParsedEntityOptions = I_ParsedEntityOptions;
export type EntityOption = I_EntityOption & Cesium.Entity.ConstructorOptions;
export type GeoJSONFeature = {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: Record<string, any> | null;
};
export type CzmPickedRes = {
  collection: Cesium.PrimitiveCollection;
  id: Cesium.Entity;
  primitive: Cesium.Primitive;
};
