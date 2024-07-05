<template>
  <div>
    <!-- 子菜单 -->
    <a-sub-menu v-for="submenu in subMenus" :key="submenu.key">
      <template #title>
        <span>
          <component :is="submenu.icon" />
          {{ submenu.title }}
        </span>
      </template>
    
    </a-sub-menu>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>

