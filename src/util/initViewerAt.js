/** 
 * @description
 * 为cesium项目初始化viewer 并加载需要的数据
*/

import * as Cesium from 'cesium';
import {
    ConfigManager,
    SceneManager,
    CameraManager
} from '../cesium_dev_helper/_lib/Manager';
import { CoordTransformer } from '../cesium_dev_helper/_lib/Compute';
import { TencentImageryProvider } from '../cesium_dev_helper/_lib/Plugin/mapPlugin';
import { DataPrepocesser } from '../cesium_dev_helper/_lib/Data';



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
    // config
    //腾讯底图
    const txOpt = {
        style: 4, //style: img、1：经典
        crs: 'WGS84',
    };
    const tcip = new TencentImageryProvider(txOpt);

    // 配置viewer
    const vcfg = {
        containerId: `${el.id}`,
        baseConfig: {
            navigationHelpButton: true,
            navigationInstructionsInitiallyVisible: true,
            // skyAtmosphere: new Cesium.SkyAtmosphere(),
        },
        providerConfig: {
            terrainProvider: [],
            imageryProvider: [
                {
                    type: 'UrlTemplateImageryProvider',
                    option: {
                        customProvider: tcip,
                    },
                },
            ],
        },
        extraConfig: {
            name: 'wuhan',
            AccessToken: import.meta.env.VITE_CESIUM_KEY,
            logo: false,
            depthTest: true,
            canvas: {
                // width: 2000,
                // height: 1500,
            },
        },
    };

    const cfgM = new ConfigManager();
    const czmViewer = await cfgM.initViewer(vcfg);

    // czmViewer 没有 readyPromise ！👹
    // 如何确保 viewer 初始化完成 ？🎃

    const sM = new SceneManager(czmViewer);
    sM.initScene();
    // console.log('cesium scene init completed');

    // 白膜加载
    const modelOpt = {
        url: "/src/mock/wuhan/tileset.json",
    }
    sM.add3DModel('3dtiles', modelOpt)

    // 切换地图到wuhan
    switchViewerTo(czmViewer)
    return czmViewer;
}
// -全局视图
const toGlobal = async (el) => {
    // 世界地图
    const vcfg = {
        containerId: `${el.id}`,
        baseConfig: {
            navigationHelpButton: true,
            navigationInstructionsInitiallyVisible: true,
        },
        providerConfig: {
            terrainProvider: [],
            imageryProvider: [],
        },
        extraConfig: {
            name: 'global',
            AccessToken: import.meta.env.VITE_CESIUM_KEY,
            logo: false,
            depthTest: true,
        },
    };
    const cfgM = new ConfigManager();
    const czmViewer = await cfgM.initViewer(vcfg);
    const sM = new SceneManager(czmViewer);
    sM.initScene();
    const cM = new CameraManager(czmViewer);
    cM.isRotationEnabled(1, 0, 0.5);// 开启地球自转
    switchViewerTo(czmViewer) //切换地图
    return czmViewer;
}


// 辅助
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

