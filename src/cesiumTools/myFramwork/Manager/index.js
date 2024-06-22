import LayerManager from './LayerManager';
import DrawingManager from './DrawingManager';
import MeasurementManager from './MeasurementManager';
import AnnotationManager from './AnnotationManager';
import ViewManager from './ViewManager';
import EventManager from './EventManager';
import AnimationManager from './AnimationManager';
import ControlsManager from './ControlsManager';


export default class Manager {
    constructor(viewer) {
        this.viewer = viewer;
        this.LayersManager = LayerManager;
        this.DrawingManager = DrawingManager;
        this.MeasurementManager = MeasurementManager;
        this.AnnotationManager = AnnotationManager;
        this.ViewManager = ViewManager;
        this.EventManager = EventManager;
        this.AnimationManager = AnimationManager;
        this.ControlsManager = ControlsManager;
    }
}