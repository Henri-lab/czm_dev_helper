<template>
  <div id="czm-container">
    <div id="czm-viewer"></div>
  </div>
</template>

<script setup>
import { onMounted, watchEffect } from 'vue';
import { useCommonStore, initViewerAt, Editor } from '../index';

const commonStore = useCommonStore();
const el = { id: 'czm-container' };

// 画笔(挂载map时创建)
let $editor;

onMounted(() => {
  // 默认地图
  initViewerAt(el, 'global').then(($viewer) => {
    // ~test-<layout/> 已經開始挂載🩸
    if ($viewer) {
      //  全局共享viewer
      commonStore.setViewer($viewer);
      //  全局共享editor (draw needs canvas)
      $editor = new Editor($viewer);
      commonStore.setEditor($editor);
    }
  });
});
watchEffect(() => {
  // commonStore.Map() ❌
  const type = commonStore.Map;
  initViewerAt(el, type).then(($viewer) => {
    if ($viewer) {
      commonStore.setViewer($viewer);
      $editor = new Editor($viewer);
      commonStore.setEditor($editor);
    }
  });
});
</script>

<style lang="scss" scoped>
#czm-container {
  width: 100%;
  height: 500px;
  background-color: bisque;
  position: relative;
  #czm-viewer {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
  }
}
</style>
