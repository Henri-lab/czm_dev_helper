<!-- 创建ceisum地图视图 并且加载对应视图的管理者 -->
<template>
  <div class="czm-texture" ref="_czmCtx_"></div>
</template>

<script setup>
import { markRaw, onMounted, watchEffect, inject } from 'vue';
import * as Cesium from 'cesium';
import _ from 'lodash';
const $bus = inject('$bus');
const $viewer = inject('$viewer');




onMounted(async () => {
  console.log(import.meta.url, '<CzmTexture> mounted')
  console.log($viewer.value, 'ctx:$viewer')
})



</script>