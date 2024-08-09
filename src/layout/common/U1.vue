<template>
  <a-menu
    class="navi-menu-U1"
    v-model:selectedKeys="naviHeadKeys"
    theme="dark"
    mode="horizontal"
    :style="{ lineHeight: '64px' }"
  >
    <!-- 选项 -->
    <a-menu-item
      v-for="item in naviHeadItems"
      :key="item.key"
      :value="item.key"
    >
      {{ item.label }}
    </a-menu-item>
  </a-menu>
</template>

<script setup>
import { ref, watch } from 'vue';
const naviHeadKeys = ref([]);
// 页面转换

// 顶部导航栏
const naviHeadItems = [
  { key: '1', label: '主页' },
  { key: '2', label: 'Cesium' },
  { key: '3', label: 'OpenLayers' },
  { key: '4', label: 'MapBox' },
  { key: '5', label: '其他1' },
  { key: '6', label: '其他2' },
];
//顶部导航的监听
watch(
  () => naviHeadKeys.value,
  (newValue) => {
    switch (newValue[0]) {
      case '1':
        $router.push({ path: '/', name: 'home' });
        break;
      case '2':
        $router.push({ path: '/czm', name: 'czm' });
        break;
      case '3':
        $router.push({ path: '/ol', name: 'ol' });
        break;
      case '4':
        $router.push({ path: '/mb', name: 'mb' });
        break;
      case '5':
        $router.push({ path: '/me', name: 'me' });
        break;
      case '6':
        $router.push({ path: '/me', name: 'me' });
        break;
      default:
        $router.push({ path: '/me', name: 'me' });
        break;
    }
  }
);
</script>

<style lang="scss" scoped></style>
