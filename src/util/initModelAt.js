import { SceneManager } from "../cesium_dev_helper/_lib/Manager";


export default async function initModelAt(viewer, modelOptions, type, cb) {
    const sM = new SceneManager(viewer);
    await sM.add3DModel(modelOptions, type, cb);
}