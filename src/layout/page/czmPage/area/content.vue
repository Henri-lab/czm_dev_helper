<template>
  <!-- 面包屑导航 📍-->
  <breadcrumb />
  <a-layout style="padding: 24px 0; background: #fff">
    <!-- 内容区左侧 📍-->
    <a-layout-sider width="200" style="background: #fff">
      <left-menu />
    </a-layout-sider>

    <!-- 内容区地图容器 📍-->
    <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
      <!-- 地球视图 -->
      <template #default>
        <czm-map></czm-map>
        <!-- <upload v-show="isUpload"></upload> -->
      </template>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue';
import breadcrumb from '../naviBars/breadcrumb/breadcrumb.vue';
import CzmMap from '@/Map/cesiumMap/CzmMap.vue';
import LeftMenu from '../naviMenu/L1.vue';

const isUpload = ref(false);
</script>

<style lang="scss" scoped></style>
