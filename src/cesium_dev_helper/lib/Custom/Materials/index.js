import * as Cesium from "cesium";
import MaterialRegister from "./MaterialRegister";
import { registerDynamicTexture, getDynamicTextureMaterial } from "./dynamicTexture";
const registerMaterial = (viewer) => {
    registerDynamicTexture(viewer);
}
const getMaterial = (name) => {
    switch (name) {
        case '#DynamicTexture':
            return getDynamicTextureMaterial();
        default:
            return Cesium.Material.fromType(name);
    }
}
export {
    MaterialRegister,
    registerMaterial,
    getMaterial
}