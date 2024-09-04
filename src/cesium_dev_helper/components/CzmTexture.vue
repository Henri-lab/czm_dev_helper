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

const $viewer = computed(() => inject('$viewer'));
const sM = inject('SceneManager');

watch(() => $viewer.value, (n, o) => {
  console.log(n, o, 'viewer changed')
}, { immediate: true })
// watch(() => sM, (n, o) => {
//   console.log(n, o, 'sceneManager changed')
// }, { immediate: true })
onMounted(() => {

})


</script>