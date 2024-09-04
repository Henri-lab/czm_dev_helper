import Manager from "./Manager";
import * as Cesium from "cesium";

// let Cesium = new Manager().Cesium;

class ControlsManager extends Manager {
    constructor(viewer) {
        super(viewer);
    }
    addScaleBar() { /* ... */ }
    addCompass() { /* ... */ }
    addLegend() { /* ... */ }
}

export default ControlsManager;