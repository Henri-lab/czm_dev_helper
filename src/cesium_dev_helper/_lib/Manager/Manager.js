import * as Cesium from "cesium";

export default class Manager {
    constructor(viewer) {
        if (viewer)
            this.viewer = viewer
        this.Cesium = Cesium
    }
}