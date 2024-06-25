<!--
 * @Description: 
 * @Author: 王海峰
 * @version: 
 * @Date: 2024-06-26 
 * @LastEditors: 
 * @LastEditTime: 
-->
<template>
  <div id="czm-viewer">
    <slot />
  </div>
</template>

<script setup>
import * as Cesium from 'cesium';
import { onMounted } from 'vue';
import app from '../main';
import { ConfigManager } from '../cesium_dev_helper/czmHelper/Manager';

const cfgM = new ConfigManager(Cesium);
const vcfg = {
  containerId: 'czm-viewer',
  viewerConfig: {
    navigationHelpButton: true,
    navigationInstructionsInitiallyVisible: true,
  },
  providerConfig: {
    terrainProvider: [
      //   {
      //     type: 'CesiumTerrainProvider',
      //     option: {
      //       url: Cesium.IonResource.fromAssetId(1),
      //     },
      //   },
    ],
    imageryProvider: [
      //   {
      //     type: 'ArcGisMapServerImageryProvider',
      //     option: {
      //       url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      //     },
      //   },
      //   {
      //     type: 'OpenStreetMapImageryProvider',
      //     option: {
      //       url: 'https://a.tile.openstreetmap.org/',
      //     },
      //   },
      //   {
      //     type: 'UrlTemplateImageryProvider',
      //     option: {
      //       url: 'https://webrd0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', // 高德地图 URL 模板
      //       subdomains: ['1', '2', '3', '4'], // 高德地图使用四个子域
      //       credit: 'Map data © 2024 Gaode Maps',
      //     },
      //   },
    ],
  },
  extraConfig: {
    AccessToken: import.meta.env.VITE_CESIUM_KEY,
    logo: false,
    depthTest: true,
  },
};
onMounted(async () => {
  await cfgM.initViewer(vcfg);
  console.log('cesium viewer init completed');
});
</script>
<style lang="scss">
#cesium-viewer {
  width: 100%;
  height: 100%;
  pointer-events: all;
}
</style>
