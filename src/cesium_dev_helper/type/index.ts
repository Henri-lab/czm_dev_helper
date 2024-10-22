import { ImageryProvider, TerrainProvider, Viewer as CesiumViewer } from "cesium";
import { EventManagerClass, LayerManagerClass } from "./Manager";

export type mapProvider = ImageryProvider | TerrainProvider;
export type CzmViewer = CesiumViewer;
export type LayerManager = LayerManagerClass;
export type EventManager = EventManagerClass;