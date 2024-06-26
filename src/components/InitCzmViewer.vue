<!--
 * @Description: 
 * @Author: 王海峰
 * @version: 
 * @Date: 2024-06-26 
 * @LastEditors: 
 * @LastEditTime: 
-->
<template>
  <div class="container">
    <div id="czm-viewer"></div>
  </div>

  <slot />
</template>

<script setup>
import { onMounted } from 'vue';
import app from '../main';
import {
  ConfigManager,
  SceneManager,
} from '../cesium_dev_helper/czmHelper/Manager';
import { TencentImageryProvider } from '../cesium_dev_helper/czmHelper/Map/mapPlugin';

//腾讯底图
const txOpt = {
  style: 4, //style: img、1：经典
  crs: 'WGS84',
};
const tCip = new TencentImageryProvider(txOpt);

// 配置viewer
const cfgM = new ConfigManager();
const vcfg = {
  containerId: 'czm-viewer',
  viewerConfig: {
    navigationHelpButton: true,
    navigationInstructionsInitiallyVisible: true,
    // skyAtmosphere: new Cesium.SkyAtmosphere(),
  },
  providerConfig: {
    terrainProvider: [],
    imageryProvider: [
      {
        type: 'ImageryLayer',
        option: {},
        customProvider: tCip,
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

onMounted(async () => {
  const czmViewer = await cfgM.initViewer(vcfg);
  //   console.log('cesium viewer init completed');

  app.config.globalProperties.$czmViewer = czmViewer;
  //   console.log('cesium viewer globalProperties loaded');

  const sM = new SceneManager(czmViewer);
  sM.initScene();
  // sM.loadTilesets();
});
</script>
<style lang="scss">
.container {
  position: relative;
  width: 1000px;
  height: 800px;
  margin: 50px auto;
  background-color: darkgray;
  #czm-viewer {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    pointer-events: all;
  }
}
</style>
