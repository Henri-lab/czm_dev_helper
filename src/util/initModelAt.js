import { SceneManager } from "../cesium_dev_helper/_lib/Manager";


export default function initModelAt(viewer, modelOptions, type, cb) {
    const sM = new SceneManager(viewer);
    sM.add3DModel(modelOptions, type, cb);
}