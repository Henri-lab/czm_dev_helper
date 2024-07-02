<template>
  <test />

  <router-view></router-view>
  <!-- <v-scale-screen width="1920" height="1080" delay="200">
    <keep-alive>
      <CesiumView />
    </keep-alive>
  </v-scale-screen> -->
</template>

<script setup>
import test from './components/test.vue';
import { onMounted } from 'vue';

onMounted(() => {});
</script>
<style></style>
