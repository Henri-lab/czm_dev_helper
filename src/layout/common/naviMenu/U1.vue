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
  { key: '2', label: '三维' },
  { key: '3', label: '二维' },
  { key: '4', label: '其他' },
  { key: '5', label: '其他1' },
  { key: '6', label: '其他2' },
];
//顶部导航的监听
watch(
  () => naviHeadKeys.value,
  (newValue) => {
    switch (newValue[0]) {
      case '1':
        $router.push({ path: '/me', name: 'me' });
        break;
      case '2':
        isShow3DMap.value = true;
        break;
      case '3':
        isShow3DMap.value = false;
        break;
      case '4':
        /* */
        isShow3DMap.value = false;
        break;
      case '5':
        /* */
        isShow3DMap.value = false;
        break;
      case '6':
        /* */
        isShow3DMap.value = false;
        break;
      default:
        isShow3DMap.value = true;
        break;
    }
  }
);
</script>

<style lang="scss" scoped></style>
