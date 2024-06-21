import LayerManager from './LayerManager';
import DrawingManager from './DrawingManager';
import MeasurementManager from './Compute/MeasurementManager';
import AnnotationManager from './AnnotationManager';
import ViewController from './ViewController';
import DataLoader from './Data/DataLoader';
import EventManager from './EventManager';
import AnimationManager from './AnimationManager';
import ControlsManager from './ControlsManager';
import CoordTransformer from './Compute/CoordTransformer';
import DataPrepocesser from './Data/DataPrepocesser';
import EffectController from './Effect/EffectController';

class CesiumFramework {
    constructor(viewer) {
        this.viewer = viewer;
        this.layers = new LayerManager(viewer);
        this.drawing = new DrawingManager(viewer);
        this.measurement = new MeasurementManager(viewer);
        this.annotations = new AnnotationManager(viewer);
        this.viewControl = new ViewController(viewer);
        this.dataLoader = new DataLoader(viewer);
        this.eventManager = new EventManager(viewer);
        this.animation = new AnimationManager(viewer);
        this.ControlsManager = new ControlsManager(viewer);
        this.EffectController = new EffectController(viewer);
    }
}

export default CesiumFramework;