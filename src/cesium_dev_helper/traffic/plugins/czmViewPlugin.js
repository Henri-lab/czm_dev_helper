/** 
 * @description
 * 为cesium项目初始化viewer 并加载需要的数据
*/

import * as Cesium from 'cesium';
import {
  ConfigManager,
  SceneManager,
} from '../../czmHelper/Manager';
import { TencentImageryProvider } from '../../czmHelper/Map/mapPlugin';
import { CameraManager } from '../../czmHelper/Manager';

// 创建地图容器
const cV = document.createElement('div');
cV.id = 'czm-viewer' + new Date().now;
document.body.appendChild(cV)




//腾讯底图
const txOpt = {
  style: 4, //style: img、1：经典
  crs: 'WGS84',
};
const tCip = new TencentImageryProvider(txOpt);

// 配置viewer
const cfgM = new ConfigManager();
const vcfg = {
  containerId: `${cV.id}`,
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
          customProvider: tCip,
        },
      },
    ],
  },
  extraConfig: {
    AccessToken: import.meta.env.VITE_CESIUM_KEY,
    logo: false,
    depthTest: true,
    canvas: {
      width: 1000,
      height: 600,
    },
  },
};

// wuhan
const wuhan = {
  longtitude: 113.95,
  latitude: 30.19,
  height: 34000,
}
const flyOpt = {
  orientation: {
    heading: Cesium.Math.toRadians(35.0),
    pitch: Cesium.Math.toRadians(-37.0),
    roll: 0.0,
  },
  duration: 2,
}


async function loadCzmViewerAt(app) {
  let _app = app;
  const czmViewer = await cfgM.initViewer(vcfg);
  // console.log('cesium viewer init completed');

  _app.config.globalProperties.$czmViewer = czmViewer;
  // console.log('cesium viewer globalProperties loaded');

  const sM = new SceneManager(czmViewer);
  sM.initScene();
  // console.log('cesium scene init completed');

  // sM.loadTilesets();


  const cM = new CameraManager(czmViewer);
  cM.flyTo(wuhan, flyOpt);
  console.log('cesium camera setting completed');
}
let cvp = null;
export default cvp = {
  async install(app) {
    await loadCzmViewerAt(app);
  }
}
