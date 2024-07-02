/** 
 * @description
 * 为cesium项目初始化viewer 并加载需要的数据
*/

import * as Cesium from 'cesium';
import {
    ConfigManager,
    SceneManager,
    CameraManager
} from '../cesium_dev_helper/czmHelper/Manager';
import { CoordTransformer } from '../cesium_dev_helper/czmHelper/Compute';
import { DataPrepocesser } from '../cesium_dev_helper/czmHelper/Data';
import { TencentImageryProvider } from '../cesium_dev_helper/czmHelper/Map/mapPlugin';


export default async function initViewer(el = { id: 'viewer' }) {

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
        viewerConfig: {
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
            AccessToken: import.meta.env.VITE_CESIUM_KEY,
            logo: false,
            depthTest: true,
            canvas: {
                // width: 2000,
                height: 1000,
            },
        },
    };

    // cameraFly configuration
    const flyOpt = {
        orientation: {
            heading: Cesium.Math.toRadians(35.0),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0.0,
        },
        duration: 2,
    }

    // 3dtiles
    const modelOpt = {
        url: "http://localhost:8001/wuhan/tileset.json",
    }



    const cfgM = new ConfigManager();
    const czmViewer = await cfgM.initViewer(vcfg);
    // console.log('cesium viewer init completed');

    const sM = new SceneManager(czmViewer);
    sM.initScene();
    // console.log('cesium scene init completed');



    sM.add3DModel(modelOpt, '3dtiles', async (tiles) => {
        const _loadedModel = await tiles[0];
        sM.handleDefaultModelEffect(_loadedModel)
        // console.log(`3d model which _id is ${_loadedModel._id} has been added to this viewer`);

        // fly to the new model
        const cM = new CameraManager(czmViewer);
        const center = CoordTransformer.getCenterFrom3dTiles(_loadedModel.model);
        center.height = 40000;
        cM.flyTo(
            center,
            flyOpt
        );
        // console.log('fly to the new model completed');
    })

    const dP = new DataPrepocesser();
}