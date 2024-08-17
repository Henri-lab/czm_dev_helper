<!-- 创建ceisum地图视图 并且加载对应视图的管理者 -->
<template>
  <div id="czm-container">
    <div id="czm-viewer"></div>
  </div>
</template>

<script setup>
import { markRaw, onMounted, watchEffect } from 'vue';
import useDefaultStore from '@/store';
import { initViewerAt, Editor } from '../index';

const defaultStore = useDefaultStore();
const el = { id: 'czm-container' };

// 创建视图 type类型的地图 加载到el元素
const init = (el, type) => {
  initViewerAt(el, type).then((viewer) => {
    if (viewer) {
      let $viewer = markRaw(viewer);
      //  全局共享viewer
      defaultStore.setViewer($viewer);
      //  全局共享editor (draw needs canvas)
      $editor = new Editor($viewer);
      defaultStore.setEditor($editor);
    }
  });
};
// 画笔(挂载map时创建)
let $editor;

onMounted(() => {
  // 默认地图
  init(el, 'global');
});
watchEffect(() => {
  const typeFromStore = defaultStore.Map;
  typeFromStore && init(el, typeFromStore);
});
</script>

<style lang="scss" scoped>
#czm-container {
  width: 100%;
  height: 1000px;
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
