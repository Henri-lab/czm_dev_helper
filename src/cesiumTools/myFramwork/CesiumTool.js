import LayerManager from './LayerManager';
import DrawingManager from './DrawingManager';
import MeasurementManager from './MeasurementManager';
import AnnotationManager from './AnnotationManager';
import ViewController from './ViewController';
import DataLoader from './DataLoader';
import EventManager from './EventManager';
import AnimationManager from './AnimationManager';
import addControls from './addControls';
import CoordTransformer from './CoordTransformer';
import DataPrepocesser from './DataPrepocesser';

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
        this.controls = new addControls(viewer);
    }
}

export default CesiumFramework;