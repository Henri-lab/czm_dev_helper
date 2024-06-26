<template>
  <InitCzmViewer />
  <!-- <v-scale-screen width="1920" height="1080" delay="200">
    <keep-alive>
      <CesiumView />
    </keep-alive>
  </v-scale-screen> -->
</template>

<script setup>
import InitCzmViewer from './components/InitCzmViewer.vue';
import { onMounted } from 'vue';

onMounted(() => {
  console.log();
});
</script>
<style></style>
