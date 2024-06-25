<!--
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-08 14:49:38
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 16:38:14
-->
<template>
  <v-scale-screen width="1920" height="1080" delay="200">
    <keep-alive>
      <CesiumView />
    </keep-alive>
  </v-scale-screen>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log()
});
</script>
<style></style>
