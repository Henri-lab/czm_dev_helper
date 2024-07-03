<template>
  <div id="czm-container">
    <div id="czm-viewer"></div>
  </div>
</template>

<script setup>
import { useCommonStore, initViewerAt, onMounted, Draw } from '../index';

// 画笔(挂载map时创建)
let $draw;

const commonStore = useCommonStore();
onMounted(() => {
  const el = { id: 'czm-container' };
  initViewerAt(el).then(async ($viewer) => {
    // ~<layout/> 已經開始挂載

    //  全局共享viewer
    commonStore.setViewer($viewer);
    //  全局共享draw (draw needs canvas)
    if ($viewer.canvas) {
      $draw = new Draw($viewer);
      commonStore.setDraw($draw);
    }
  });
});
</script>

<style lang="scss" scoped>
#czm-container {
  width: 100%;
  height: 700px;
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
