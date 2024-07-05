<template>
  <div>
    <!-- 选项 -->
    <a-menu-item v-for="item in submenu.items" :key="item.key">{{
      item.label
    }}</a-menu-item>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
