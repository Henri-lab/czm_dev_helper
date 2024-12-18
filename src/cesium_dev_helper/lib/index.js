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
} from './Effect'

import {
    EntityDrawer,
    EntityMaker,
    Editor,
} from './Editor'

import {
    DataLoader,
    DataPrepocesser,
    gifLoader,
    defaultHierachyCache,
    hierarchyNavigate,
} from './Data'

import {
    TextureCreator,
    PopupCreator
} from './Creator'


import {
    MaterialRegister,
} from './Custom'


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
    defaultHierachyCache,
    gifLoader,
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
}

const EditorModule = {
    EntityDrawer,
    EntityMaker,
    Editor,
}

const CustomModule = {
    MaterialRegister,
}

const CreatorModule = {
    TextureCreator,
    PopupCreator,
}

export default {
    ComputeModule,
    DataModule,
    ManagerModule,
    EffectModule,
    EditorModule,
    CustomModule,
    CreatorModule,
}

