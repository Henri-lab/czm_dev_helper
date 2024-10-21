import * as Cesium from "cesium";
import MaterialRegister from "./MaterialRegister";
import { registerDynamicTexture, optionsHookOfDynamicTextureMaterial } from "./dynamicTexture";
let defaultMaterials
let dynamicTexture;
let customWaterMaterial;

//viewer 暂时不是需要的

//可以自定义
const registerMaterial = (type, options, viewer) => {
    type = type.toLowerCase();
    if (type === 'default') {
        return registerDefaultMaterials();
    }
    if (type == 'texture:dynamic') {
        dynamicTexture = registerDynamicTexture(options, viewer);
        return dynamicTexture;
    }
    if (type == 'texture:water') {
        customWaterMaterial = registerMaterials_CustomWater('customWater', options, viewer);
        return customWaterMaterial;
    }
}


const getMaterial = (name, options) => {
    switch (name) {
        case '#DynamicTexture':
            return registerMaterial('texture:dynamic', options) || console.error('Material:dynamicTexture is null');
        case '#DynamicTexture:CustomWater':
            return registerMaterial('texture:water', options) || console.warn('Material:customWaterMaterial is null');
        default:
            return Cesium.Material.fromType(name) || console.warn('Material:' + name + ' is null');
    }
}


//辅助
const registerDefaultMaterials = () => {
    //除cesium自带材质以外的 默认材质
    defaultMaterials = {
        image: registerDynamicTexture(),
        water: registerMaterials_CustomWater()
    }
    return defaultMaterials;
}
const registerMaterials_CustomWater = (options, viewer) => {
    let uniforms = null, glsl = '';
    if (options) {
        options.uniforms && (uniforms = options.uniforms)
        options.glsl && (glsl = options.glsl)
    }
    const custom_water_options = optionsHookOfDynamicTextureMaterial.water({ uniforms, glsl })
    customWaterMaterial = registerDynamicTexture('customWater',custom_water_options/*give custom-options to MaterialRegister*/, viewer)
    return customWaterMaterial;
}



export {
    MaterialRegister,
    // 材质注册
    registerMaterial,
    //材质获取
    getMaterial,
}