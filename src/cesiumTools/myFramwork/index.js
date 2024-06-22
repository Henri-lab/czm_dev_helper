import Manager from './Manager';
import CoordTransformer from './Compute/CoordTransformer';
import DataPrepocesser from './Data/DataPrepocesser';
import EffectController from './Effect/EffectController';
import * as Cesium from 'cesium';



class CesiumFramework {
    constructor(viewer) {
        this.viewer = viewer;
        this.Manager = Manager
        this.EffectController = new EffectController(viewer);
        this.dataPrepocesser = new DataPrepocesser(Cesium);
        this.coordTransformer = new CoordTransformer();
    }
}

export default CesiumFramework;