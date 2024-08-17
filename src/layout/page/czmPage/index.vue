<template>
  <a-layout>
    <!-- 头部 -->
    <a-layout-header class="header">
      <my-head />
    </a-layout-header>
    <!-- 内容主体 -->
    <a-layout-content style="padding: 0 50px">
      <my-content />
    </a-layout-content>
    <!-- 底部 -->
    <a-layout-footer style="text-align: center">
      <my-foot />
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import MyHead from '../czmPage/area/head.vue';
import MyFoot from '../czmPage/area/foot.vue';
import MyContent from '../czmPage/area/content.vue';
</script>

<style lang="scss" scoped>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}

.header {
  display: none;
}
</style>
