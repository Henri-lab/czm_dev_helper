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


let curViewer = null;  //导出的地图

let cacheViewers = [];//导出的地图集


/**
 * Initializes a Cesium viewer at a specified element with a specific map type.
 *
 * @param {Object} [el={ id: 'viewer' }] - The HTML element where the viewer will be created.
 * @param {string} type - The type of map to be displayed. Can be either 'global' or 'wuhan-test' or else.
 * @returns {Promise<Cesium.Viewer>} - A promise that resolves to the initialized Cesium viewer.
 *
 * @example
 * // Initialize a viewer at the element with id 'cesiumContainer' and display the global map
 * const viewer = await initViewerAt({ id: 'cesiumContainer' }, 'global');
 *
 * // Initialize a viewer at the default element and display the wuhan-test map
 * const viewer = await initViewerAt({}, 'wuhan-test');
 */

let curType = 'global' //当前地图类型
export default async function initViewerAt(el = { id: 'viewer' }, typeId) {
    curType = typeId.toLowerCase();
    // 查找缓存
    const oldViewer = cacheViewers.find(cache => cache.typeId === typeId)
    if (oldViewer) return oldViewer.data;
    // 缓存没有，则初始化
    // 切换地图资源
    if (curType === 'global') {
        await toGlobal(el);
    } else if (curType === 'wuhan-123') {
        await toWuhan(el);
    }
    return curViewer;
}

// 地图配置
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

// --辅助--
function switchViewerTo(viewer) {
    if (curViewer && curViewer !== viewer) {
        cacheViewers.push({
            typeId: curType,
            data: curViewer
        });//销毁前缓存
        destroyViewer(curViewer);
    }
    // 设置为导出的currentViewer
    curViewer = viewer;
}
function destroyViewer(viewer) {
    if (viewer) {
        // console.log('destroy', viewer.name)
        viewer.destroy();
        viewer = null;
    }
}

