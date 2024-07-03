<template>
  <div id="czm-container">
    <div id="czm-viewer"></div>
  </div>
</template>

<script setup>
import { useCommonStore, initViewer, onMounted } from '../index';

const commonStore = useCommonStore();
onMounted(() => {
  const el = { id: 'czm-container' };
  initViewer(el).then((viewer) => {
    //  全局共享viewer
    commonStore.setViewer(viewer);
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
