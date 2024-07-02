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

// function sleep(time) {
//   return new Promise((resolve) => setTimeout(resolve, time));
// }
const app = getCurrentInstance();

onMounted(() => {
  // sleep(0);
  
});


</script>
<style lang="scss"></style>
