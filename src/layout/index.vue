<template>
  <div class="layout">
    <!-- 头部 -->
    <div class="logo"></div>
    <!-- 顶部导航菜单 -->
    <NaviMenuU1></NaviMenuU1>
    <!-- 路由页面 -->
    <!-- <router-view /> -->
    <czmPage />


    <!-- test 水印 -->
    <div class="layout-router-view">
      <el-watermark :font="font" :content="['henriFox', '1842208351@qq.com']">
        <div class='layout-watermark' />
      </el-watermark>
    </div>
  </div>
</template>

<script setup>
import NaviMenuU1 from './common/U1.vue';
import czmPage from './page/czmPage/index.vue'
const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  background: #fff;

  .logo::before {
    width: 100%;
    height: 60px;
    background: #fff;
    content: '--logo--';
  }

  .layout-router-view {
    width: 100%;
    height: calc(100% - 60px);
    background: #fff;

    .layout-watermark {
      // width: 500px;
      height: 500px;
    }
  }
}
</style>
