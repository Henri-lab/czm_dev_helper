<template>
  <slot />
</template>

<script setup>
import {
  onMounted,
  getCurrentInstance,
  ref,
  computed,
  watchEffect,
  watch,
} from 'vue';
import { $viewer } from '../plugins/czmViewPlugin';
// function sleep(time) {
//   return new Promise((resolve) => setTimeout(resolve, time));
// }
const app = getCurrentInstance();
const flag = ref($viewer.flag);
onMounted(() => {
  // sleep(0);
  console.log($viewer, 'viewer is already?');
});

</script>
<style lang="scss"></style>
