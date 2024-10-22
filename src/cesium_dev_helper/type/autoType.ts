// henrifoxdeMacBook-Pro:czm_dev_helper henrifox$ ./shell/type.sh
// (node:38119) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
// (Use `node --trace-deprecation ...` to show where the warning was created)
// To parse this data:
//
//   import { Convert, CzmHelper } from "./file";
//
//   const czmHelper = Convert.toCzmHelper(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CzmHelper {
  czmHelper: CzmHelperClass;
}

export interface CzmHelperClass {
  ComputeModule: ComputeModule;
  DataModule: DataModule;
  ManagerModule: ManagerModule;
  EffectModule: EffectModule;
  EditorModule: EditorModule;
  CustomModule: CustomModule;
  CreatorModule: CreatorModule;
}

export interface ComputeModule {
  CoordTransformer: null;
  TurfUser: null;
  generateCirclePoints: null;
  getCirclePoint: null;
  pointsToPositions: null;
  flattenPositions: null;
  getPositions: null;
  getSiteTimes: null;
  spaceDistance: null;
}

export interface CreatorModule {
  TextureCreator: null;
  PopupCreator: null;
}

export interface CustomModule {
  MaterialRegister: null;
}

export interface DataModule {
  DataLoader: null;
  DataPrepocesser: null;
  defaultHierachyCache: null;
  gifLoader: null;
  hierarchyNavigate: null;
}

export interface EditorModule {
  EntityDrawer: null;
  EntityMaker: null;
  Editor: null;
}

export interface EffectModule {
  EffectController: null;
}

export interface ManagerModule {
  LayerManager: null;
  DrawingManager: null;
  MeasurementManager: null;
  AnnotationManager: null;
  CameraManager: null;
  EventManager: null;
  AnimationManager: null;
  ControlsManager: null;
  ConfigManager: null;
  SceneManager: null;
}


