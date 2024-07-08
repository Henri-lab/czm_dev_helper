import { SceneManager } from "../cesium_dev_helper/_lib/Manager";


export default async function initModelAt(viewer, type, modelOptions, cb) {
    const sM = new SceneManager(viewer);
    await sM.add3DModel(type, modelOptions, cb);
}