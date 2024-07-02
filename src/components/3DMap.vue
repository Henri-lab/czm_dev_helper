<template>
  <div id="czm-container">
    <div id="czm-viewer"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import initViewer from '../util/initViewer';

onMounted(() => {
  const el = { id: 'czm-container' };
  initViewer(el);
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
