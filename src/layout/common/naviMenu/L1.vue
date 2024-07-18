<template>
  <a-menu
    v-model:selectedKeys="naviSideKeys"
    v-model:openKeys="openKeys"
    mode="inline"
    style="height: 100%"
  >
    <!-- 子菜单 -->
    <subMenuL2></subMenuL2>
  </a-menu>
</template>

<script setup>
import { ref, watch } from 'vue';
import subMenuL2 from './subMenu/L2.vue';

const naviSideKeys = ref([]); //sub-menu-item-key
const openKeys = ref([]); //sub-menu-key

// 侧边导航菜单项的监听
watch(
  () => naviSideKeys.value,
  (newValue) => {
    switch (newValue[0]) {
      case '1':
        break;
      case '4':

      case '5':

      case '6':

      case '7':

      default:
        break;
    }
  }
);
</script>

<style lang="scss" scoped></style>
