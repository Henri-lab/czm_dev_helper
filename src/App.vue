<template>
  <div class="whole-page">
    <!-- test -->
    <div class="test">
      <span style="color: white;">测试：</span>
      <router-link to="/login"><el-button type="success" size="large">登录界面</el-button></router-link>&nbsp;&nbsp;
      <router-link to="/layout"><el-button type="success" size="large">Cesium界面</el-button></router-link>&nbsp;&nbsp;
      <router-link to="/subapp/weather/"><el-button type="primary" size="large">子应用</el-button></router-link>&nbsp;&nbsp;
    </div>
    <router-view></router-view>
  </div>
</template>


<script setup lang="ts">
// test
// import ColorPicker from '@/components/ColorPicker/index.vue'

</script>
<style lang="scss" scoped>
.test {
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  z-index: 999;
}

@import './index.scss';
</style>
