import {
    CoordTransformer,
    TurfUser,
    generateCirclePoints,
    getCirclePoint,
    pointsToPositions,
    flattenPositions,
    getPositions,
    getSiteTimes,
    spaceDistance
} from './Compute'

import {
    ConeGlowBottomCircleMaterialProperty,
    CustomMaterialProperty,
    WallGradientsMaterialProperty,
} from './Custom/Property'

import {
    LayerManager,
    DrawingManager,
    MeasurementManager,
    AnnotationManager,
    CameraManager,
    EventManager,
    AnimationManager,
    ControlsManager,
    ConfigManager,
    SceneManager,
} from './Manager'

import {
    EffectController,
    MaterialCreator,
    TextureCreator,
    ConeGlowBottomCircleMaterialProperty,
    WallGradientsMaterialProperty,
} from './Effect'

import {
    Draw,
    Graphics,
    Editor,
} from './Editor'

import {
    DataLoader,
    DataPrepocesser,
    gifLoader,
    defaultHierachyCache,
    hierarchyNavigate,
} from './Data'


// module
const ComputeModule = {
    CoordTransformer,
    TurfUser,
    generateCirclePoints,
    getCirclePoint,
    pointsToPositions,
    flattenPositions,
    getPositions,
    getSiteTimes,
    spaceDistance
}
const DataModule = {
    DataLoader,
    DataPrepocesser,
    gifLoader,
    defaultHierachyCache,
    hierarchyNavigate,
}
const ManagerModule = {
    LayerManager,
    DrawingManager,
    MeasurementManager,
    AnnotationManager,
    CameraManager,
    EventManager,
    AnimationManager,
    ControlsManager,
    ConfigManager,
    SceneManager,
}
const EffectModule = {
    EffectController,
    MaterialCreator,
    TextureCreator,
    ConeGlowBottomCircleMaterialProperty,
    WallGradientsMaterialProperty,
}

const EditorModule = {
    Draw,
    Graphics,
    Editor,
}

export default {
    ComputeModule,
    DataModule,
    ManagerModule,
    EffectModule,
    EditorModule,
}