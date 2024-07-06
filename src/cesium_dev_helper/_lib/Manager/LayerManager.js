import Manager from "./Manager";
import * as Cesium from "cesium";

// let Cesium = new Manager().Cesium;
//管理imageryLayers,datasource
class LayerManager extends Manager {
    constructor(viewer) {
        super(viewer);
        this.layers = [];
        this.datesources = [];
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

    getOrCreateDatasourceByName(name) {
        if (!typeof name === 'string') return null;
        const _viewer = this.viewer
        let dataSource = _viewer.dataSources.getByName(name)[0];
        if (!dataSource) {
            dataSource = new Cesium.CustomDataSource(name);
            _viewer.dataSources.add(dataSource);
        }
        return dataSource;
    }
}


export default LayerManager;