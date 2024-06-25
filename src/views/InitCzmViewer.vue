<!--
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-08 16:34:13
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 16:40:27
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

const initer = new ConfigManager(Cesium);
const config = {
  containerId: 'czm-viewer',
  viewerConfig,
  extraConfig,
  MapImageryList,
  imageryProvider,
};
onMounted(async () => {});
</script>
<style>
#cesium-viewer {
  width: 100%;
  height: 100%;
  pointer-events: all;
}
</style>
