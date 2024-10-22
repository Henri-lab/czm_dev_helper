import * as Cesium from 'cesium';

export class Manager{
    viewer: Cesium.Viewer;
}


export class LayerManager extends Manager {
    layers: Cesium.ImageryLayer[];
    customCache: Cesium.CustomDataSource[];

    constructor(viewer: Cesium.Viewer);

    addLayer(layer: Cesium.ImageryLayer): void;

    removeLayer(layer: Cesium.ImageryLayer): void;

    showLayer(layer: Cesium.ImageryLayer): void;

    hideLayer(layer: Cesium.ImageryLayer): void;

    getOrCreateDatasourceByName(name: string): Cesium.CustomDataSource | null;

    getDatasourceByName(name: string): Cesium.CustomDataSource | null;

    addDatasourceByName(name: string): Cesium.CustomDataSource | null;

    static getOwnerOfEntity(entity: Cesium.Entity): Cesium.DataSource | Cesium.CompositeEntityCollection;
}