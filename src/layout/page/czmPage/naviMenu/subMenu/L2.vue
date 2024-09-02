<template>
  <!-- 子菜单 -->
  <a-sub-menu v-for="submenu in subMenus" :key="submenu.code">
    <template #title>
      <span>
        <component :is="submenu.icon" />
        {{ submenu.label }}
      </span>
    </template>
    <!-- 选项 -->
    <subItemL3 :submenu_type="submenu.type"></subItemL3>
  </a-sub-menu>
</template>

<script setup>
import subItemL3 from '../subItem/L3.vue';
import { menuOption } from '../config';
// 侧边导航栏
const subMenus = menuOption();
</script>

<style lang="scss" scoped></style>
