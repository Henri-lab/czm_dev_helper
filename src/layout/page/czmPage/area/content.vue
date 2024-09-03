<template>
  <div class="content">
    <!-- 面包屑导航 📍-->
    <breadcrumb />
    <a-layout style="padding: 24px 0; background: #fff">
      <!-- 内容区左侧 📍-->
      <a-layout-sider width="200" style="background: #fff">
        <left-menu />
      </a-layout-sider>

      <!-- 内容区地图容器 📍-->
      <a-layout-content class="sub-content" :style="{ padding: '0 24px', minHeight: '280px' }">
        <!-- 地球视图 -->
        <template #default>
          <czm-map></czm-map>
          <Panel class="panel"></Panel>
        </template>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import breadcrumb from '../naviBars/breadcrumb/breadcrumb.vue';
import CzmMap from '@/Map/cesiumMap/CzmMap.vue';
import LeftMenu from '../naviMenu/L1.vue';
import Panel from '@/components/Panel/index.vue'
</script>

<style lang="scss" scoped>
.content {
  @include layout100('%');

  .sub-content {
    @include layout100('%');
    position: relative;

    .panel {
      width: 15%;
      position: absolute;
      right: 2%;
      top: 2%;
    }
  }
}
</style>
