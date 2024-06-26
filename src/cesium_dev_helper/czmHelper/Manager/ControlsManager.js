import Manager from "./Manager";

let Cesium = new Manager().Cesium;

class ControlsManager extends Manager {
    constructor(viewer) {
        super(viewer);
    }
    addScaleBar() { /* ... */ }
    addCompass() { /* ... */ }
    addLegend() { /* ... */ }
}

export default ControlsManager;