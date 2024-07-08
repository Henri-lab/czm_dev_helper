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

    // cameraFly configuration
    const flyOpt = {
        position: {//wuhan
            longitude: 114.2977,
            latitude: 30.5961,
            height: 40000,
        },
        effectOptions: {
            orientation: {
                heading: Cesium.Math.toRadians(35.0),
                pitch: Cesium.Math.toRadians(-90.0),
                roll: 0.0,
            },
            duration: 2,
        }

    }
    // 3dtiles
    const modelOpt = {
        // port 8001
        url: "http://localhost:8001/wuhan/tileset.json",
    }



    const cfgM = new ConfigManager();
    const czmViewer = await cfgM.initViewer(vcfg);

    // czmViewer 没有 readyPromise ！👹
    // 如何确保 viewer 初始化完成 ？🎃

    const sM = new SceneManager(czmViewer);
    sM.initScene();
    // console.log('cesium scene init completed');



    const cM = new CameraManager(czmViewer);
    cM.flyTo(flyOpt);
    // console.log('cesium camera location completed');

    // 白膜加载
    // sM.add3DModel(modelOpt, '3dtiles', async (tiles) => {
    //     const _loadedModel = await tiles[0];
    //     sM.handleDefaultModelEffect(_loadedModel)
    //     // console.log(`3d model which _id is ${_loadedModel._id} has been added to this viewer`);
    //     // fly to the new model
    //     const cM = new CameraManager(czmViewer);
    //     const center = CoordTransformer.getCenterFrom3dTiles(_loadedModel.model);
    //     center.height = 40000;
    //     const _center = center;
    //     cM.flyTo(
    //         _center,
    //         flyOpt
    //     );
    //     // console.log('fly to the new model completed');
    // })


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
            // skyAtmosphere: new Cesium.SkyAtmosphere(),
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
            canvas: {
                // width: 2000,
                // height: 1500,
            },
        },
    };

    // const viewConfig = {
    //     heading: 100.0,
    //     pitch: -90.0,
    //     roll: 100.0,
    // }

    const cfgM = new ConfigManager();
    const czmViewer = await cfgM.initViewer(vcfg);
    const sM = new SceneManager(czmViewer);
    sM.initScene();
    const cM = new CameraManager(czmViewer);

    // cM.setView(viewConfig);

    cM.rotateEarth();// 没效果？？？？？？？？？？？？？？？？？？

    // 切换地图
    switchViewerTo(czmViewer)

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

