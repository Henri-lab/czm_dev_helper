```javascript
/**
 * @description
 * 为cesium项目初始化viewer 并加载需要的数据
 */

import * as Cesium from 'cesium';
import {
  ConfigManager,
  SceneManager,
  CameraManager,
} from '../cesium_dev_helper/czmHelper/Manager';
import { TencentImageryProvider } from '../cesium_dev_helper/czmHelper/Map/mapPlugin';

// 创建地图容器
const cV = document.createElement('div');
cV.id = 'czm-viewer' + new Date().now;
document.body.appendChild(cV);

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
    skyAtmosphere: new Cesium.SkyAtmosphere(),
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
  longitude: 113.95,
  latitude: 30.19,
  height: 34000,
};
const flyOpt = {
  orientation: {
    heading: Cesium.Math.toRadians(35.0),
    pitch: Cesium.Math.toRadians(-90.0),
    roll: 0.0,
  },
  duration: 2,
};

// 3dtiles
function suc(tileset) {
  console.log('load 3d model success', tileset);
}
function err(e) {
  console.log('load 3d model error', e);
}

function progress(progress) {
  console.log('load 3d model progress', progress);
}
const modelOpt = {
  url: 'src/cesium_dev_helper/traffic/assets/model/tileset.json',
  options: {
    onSuccess: suc,
    onError: err,
    onProgress: progress,
  },
};

async function loadCzmViewerAt(app) {
  let _app = app;
  const czmViewer = await cfgM.initViewer(vcfg);
  console.log('cesium viewer init completed');

  _app.config.globalProperties.$czmViewer = czmViewer;
  console.log('cesium viewer globalProperties loaded');

  const sM = new SceneManager(czmViewer);
  sM.initScene();
  console.log('cesium scene init completed');

  await sM.add3DTiles(modelOpt, (tiles) => {
    const _loaded = tiles[0];
    console.log(_loaded);
    sM.handleDefaultModelEffect(_loaded);
    _app.config.globalProperties.$czmLoaded3dTile = _loaded;
  });
  console.log('3d model init completed');

  const cM = new CameraManager(czmViewer);
  cM.flyTo(wuhan, flyOpt);
  console.log('cesium camera setting completed');
}
let cvp = null;
export default cvp = {
  async install(app) {
    await loadCzmViewerAt(app);
  },
};
```
