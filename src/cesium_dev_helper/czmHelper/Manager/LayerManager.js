import Manager from "./Manager";

let Cesium = new Manager().Cesium;

class LayerManager extends Manager {
    constructor(viewer) {
        super(viewer);
        this.layers = [];
    }
    addLayer(layer) { /* ... */
        this.layers.push(layer);
        this.viewer.imageryLayers.addImageryProvider(layer);
    }
    removeLayer(layer) { /* ... */
        const index = this.layers.indexOf(layer);
        if (index !== -1) {
            this.layers.splice(index, 1);
            this.viewer.imageryLayers.remove(layer);
        }
    }
    showLayer(layer) { /* ... */
        const index = this.viewer.imageryLayers.indexOf(layer);
        if (index !== -1) {
            this.viewer.imageryLayers.get(index).show = true;
        }
    }
    hideLayer(layer) { /* ... */
        const index = this.viewer.imageryLayers.indexOf(layer);
        if (index !== -1) {
            this.viewer.imageryLayers.get(index).show = false;
        }
    }
}


export default LayerManager;