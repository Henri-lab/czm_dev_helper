<template>
  <!-- <layout></layout> -->
  <!-- <router-view></router-view> -->
  <!-- <v-scale-screen width="1920" height="1080" delay="200">
    <keep-alive>
      <CesiumView />
    </keep-alive>
  </v-scale-screen> -->
  <editor></editor>
</template>

<script setup>
import layout from './layout/index.vue';
import { Editor } from './components/Editor/index.vue';
import { onMounted } from 'vue';

onMounted(() => { });
</script>
<style></style>
