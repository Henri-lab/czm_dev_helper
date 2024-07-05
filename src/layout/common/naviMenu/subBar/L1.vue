<template>
  <div>
    <!-- 左侧菜单栏 -->
    <a-layout-sider width="200" style="background: #fff" v-if="isShow3DMap">
      <a-menu
        v-model:selectedKeys="naviSideKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        style="height: 100%"
      > 
      </a-menu>
    </a-layout-sider>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>