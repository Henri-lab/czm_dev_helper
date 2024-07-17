import Manager from "./Manager";
import * as Cesium from "cesium";

// let Cesium = new Manager().Cesium;
//管理imageryLayers,datasource
class LayerManager extends Manager {
    constructor(viewer) {
        super(viewer);
        this.layers = [];
        this.datasources = [];
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

    //是否有必要保证图源的唯一性？🙄

    // Cesium 中的 DataSource 提供了一种管理和组织实体的方式，使得对实体的批量操作和管理更加方便。
    // 通常使用 CustomDataSource 来创建自定义的数据源，然后将实体添加到这个数据源中。
    getOrCreateDatasourceByName(name) {
        if (!typeof name === 'string') return null;
        const _viewer = this.viewer
        // find
        let dataSource = _viewer.dataSources.getByName(name)[0];
        console.log(dataSource, 'find?')
        if (!dataSource) {
            dataSource = new Cesium.CustomDataSource(name);
            this.datasources.push(dataSource);
        }
        return dataSource;
    }

    // 没有图源就创建图源 并添加到viewer
    // 有图源直接添加到viewer
    addDatasourceByName(name) {
        if (!typeof name === 'string') return null;
        let _viewer = this.viewer
        let _datasources = this.datasources
        const existedSourceOrNew = this.getOrCreateDatasourceByName(name);
        if (!existedSourceOrNew) {//图源未在viewer中
            _datasources.push(existedSourceOrNew)
        }
        _datasources.forEach(ds => {
            ds && _viewer.dataSources.add(ds);
            // _viewer.zoomTo(ds)
        });
    }
}


export default LayerManager;