/** 
 * @description
 * 为cesium项目初始化viewer 并加载需要的数据
*/

import * as Cesium from 'cesium';
import {
    ConfigManager,
    SceneManager,
    CameraManager
} from '@czmHelper/Manager';
import { get_vcfg_wuhan, modelOpt_wuhan, get_vcfg_global } from '../Map';


let currentViewer = null;  //导出的地图

let viewers = [];//导出的地图集


/**
 * Initializes a Cesium viewer at a specified element with a specific map type.
 *
 * @param {Object} [el={ id: 'viewer' }] - The HTML element where the viewer will be created.
 * @param {string} type - The type of map to be displayed. Can be either 'global' or 'wuhan'.
 * @returns {Promise<Cesium.Viewer>} - A promise that resolves to the initialized Cesium viewer.
 *
 * @example
 * // Initialize a viewer at the element with id 'cesiumContainer' and display the global map
 * const viewer = await initViewerAt({ id: 'cesiumContainer' }, 'global');
 *
 * // Initialize a viewer at the default element and display the Wuhan map
 * const viewer = await initViewerAt({}, 'wuhan');
 */
export default async function initViewerAt(el = { id: 'viewer' }, type) {
    const _type = type.toLowerCase();
    // 切换地图资源
    if (_type === 'global') {
        await toGlobal(el);
    } else if (_type === 'wuhan') {
        await toWuhan(el);
    }
    return currentViewer;
}

// 地图配置
// -武汉地图
const toWuhan = async (el) => {
    const cfgM = new ConfigManager();
    const vcfg_wuhan = get_vcfg_wuhan(el.id);
    const czmViewer = await cfgM.initViewer(vcfg_wuhan);
    const sM = new SceneManager(czmViewer);
    sM.initScene();
    sM.add3DModel('3dtiles', modelOpt_wuhan)
    switchViewerTo(czmViewer)
    return czmViewer;
}
// -全局视图
const toGlobal = async (el) => {
    const vcfg_global = get_vcfg_global(el.id);
    const cfgM = new ConfigManager();
    const czmViewer = await cfgM.initViewer(vcfg_global);
    const sM = new SceneManager(czmViewer);
    sM.initScene();
    const cM = new CameraManager(czmViewer);
    cM.isRotationEnabled(1, 0, 0.5);// 开启地球自转
    switchViewerTo(czmViewer) //切换地图
    return czmViewer;
}

// --辅助--
function switchViewerTo(viewer) {
    if (currentViewer && currentViewer !== viewer) {
        destroyViewer(currentViewer);
    }
    // 设置为导出的currentViewer
    currentViewer = viewer;
}
function destroyViewer(viewer) {
    if (viewer) {
        // console.log('destroy', viewer.name)
        viewer.destroy();
        viewer = null;
    }
}

