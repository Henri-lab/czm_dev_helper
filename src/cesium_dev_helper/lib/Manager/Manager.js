import * as Cesium from "cesium";
import mitt from "mitt";
const bus = mitt();

export default class Manager {
    constructor(viewer) {
        if (viewer) this.viewer = viewer
        this.$bus = bus
        // this.Cesium = Cesium
    }
}