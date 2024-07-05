<template>
  <!-- 地图容器 -->
  <a-layout-content
    :style="{ padding: '0 24px', minHeight: '280px' }"
    v-if="isShow3DMap"
  >
    <template #default>
      <CzmMap />
    </template>
  </a-layout-content>
</template>

<script setup></script>

<style lang="scss" scoped></style>
