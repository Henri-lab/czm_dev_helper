<template>
  <div>
    <!-- 头部 -->
    <a-layout-header class="header">
      <div class="logo" />
      <!-- 顶部导航栏 -->
      <!-- 双向绑定 -->
      <a-menu
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
    </a-layout-header>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
