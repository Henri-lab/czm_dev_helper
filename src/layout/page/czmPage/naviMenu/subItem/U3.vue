<template>
  <!-- 菜单下拉选项 -->
  <a-menu-item v-for="item in naviHeadItems" :key="item.key" :value="item.key">
    {{ item.label }}
  </a-menu-item>
</template>

<script setup>
// 顶部导航栏
const naviHeadItems = [
  { key: '1', label: '主页' },
  { key: '2', label: '三维' },
  { key: '3', label: '二维' },
  { key: '4', label: '其他' },
  { key: '5', label: '其他1' },
  { key: '6', label: '其他2' },
];
</script>

<style lang="scss" scoped></style>
