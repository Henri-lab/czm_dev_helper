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
import { DataPrepocesser } from '../cesium_dev_helper/czmHelper/Data';
import { TencentImageryProvider } from '../cesium_dev_helper/czmHelper/Map/mapPlugin';



// 创建地图容器
const cV = document.createElement('div');
cV.id = 'czm-viewer' + Date.now();
document.body.appendChild(cV)

//腾讯底图
const txOpt = {
  style: 4, //style: img、1：经典
  crs: 'WGS84',
};
const tcip = new TencentImageryProvider(txOpt);

// 配置viewer
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
      width: 1500,
      height: 1000,
    },
  },
};

// wuhan
const wuhan = {
  longitude: 113,
  latitude: 30,
  height: 20000,
}
const flyOpt = {
  orientation: {
    heading: Cesium.Math.toRadians(35.0),
    pitch: Cesium.Math.toRadians(-90.0),
    roll: 0.0,
  },
  duration: 2,
}

// 3dtiles
function suc(model) {
  console.log('loaded model:', model);
}
function err(e) {
  console.error('loading 3d model error:', e);
}

let percent;
function pgs(progress) {
  percent = progress
  console.log('loading 3d model progress:', progress);
}
const modelOpt = {
  url: "http://localhost:8001/wuhan/tileset.json",
  onSuccess: suc,
  onError: err,
  onProgress: pgs,
}


async function loadCzmViewerAt(app) {
  let _app = app;

  const cfgM = new ConfigManager();
  const czmViewer = await cfgM.initViewer(vcfg);
  console.log('cesium viewer init completed');

  const sM = new SceneManager(czmViewer);
  sM.initScene();
  console.log('cesium scene init completed');

  const cM = new CameraManager(czmViewer);
  cM.flyTo(wuhan, flyOpt);
  console.log('cesium camera setting completed');

  sM.add3DModel(modelOpt, '3dtiles', async (tiles) => {
    console.log('loading model...', tiles);
    const _loadedModel = await tiles[0];
    console.log('loaded model', _loadedModel);
    // sM.handleDefaultModelEffect(_loadedModel)
    console.log(`3d model which _id is ${_loadedModel._id} init completed`);
  })

  // test
  // let tile;
  // try {
  //   const res = await new Cesium.Cesium3DTileset({ url: "http://localhost:8001/wuhan/tileset.json" })
  //   console.log(res, 'model')
  //   tile = czmViewer.scene.primitives.add(res)
  //   sM.handleDefaultModelEffect(tile)
  // } catch (e) {
  //   console.log('cesium 3dtiles load error1', e)
  // }


  // const dataHandler = new DataPrepocesser();
  // dataHandler.update3dtilesMaxtrix(0, 0, tile);
  return czmViewer;

}
let $viewer = { flag: 0 };
let czmViewPlugin = {
  async install(app) {
    const viewer = await loadCzmViewerAt(app);
    // console.log('plugin')
    $viewer.data = viewer;
    $viewer.flag = 1;
    //app不会等里面的异步操作
    // app.config.globalProperties.$viewer = viewer;
  }
};


export { czmViewPlugin, $viewer }
