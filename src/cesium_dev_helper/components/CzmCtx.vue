<!-- 创建ceisum地图视图 并且加载对应视图的管理者 -->
<template>
  <div class="czm-texture" ref="_czmCtx_"></div>
</template>

<script setup>
import { markRaw, onMounted, watch, inject, computed } from 'vue';
import * as Cesium from 'cesium';
import _ from 'lodash';
const $bus = inject('$bus');
const $store = inject('$store');
let $viewer
let $scene
let $camera
$bus.on('czmViewerEvent@henrifox', (viewer) => {
  console.log(viewer, 'ctx:$viewer')
  $viewer = viewer
  $scene = $viewer.scene
  $camera=$viewer.camera
})
defineExpose({ $viewer, $scene ,$camera})



</script>