<template>
  <!-- 菜单下拉选项 -->
  <a-menu-item class="subItem-L3" v-for="item in submenu_items" :key="item.key">
    {{ item.label }}
  </a-menu-item>
</template>

<script setup>
import { computed } from 'vue';
import {
  pencilMenuItems,
  materialMenuItems,
  sceneMenuItems,
  sourceMenuItems,
  toolMenuItems,
  threeMenuItems,
  userMenuItems,
} from './config';

// menu组件指定了submenu_items_type，根据该值获取菜单项
const props = defineProps({
  submenu_type: {
    type: String,
    required: true,
    // default: 'undefine',
  },
});
// 菜单组名称-菜单项 映射表
const menuItemsMap = {
  'pencil-menu': pencilMenuItems,
  'material-menu': materialMenuItems,
  'scene-menu': sceneMenuItems,
  'source-menu': sourceMenuItems,
  'tool-menu': toolMenuItems,
  'three-menu': threeMenuItems,
  'user-menu': userMenuItems,
};
// 根据submenu_items_type获取到的菜单项 + 性能考虑
const submenu_items = computed(() => {
  const _type = props.submenu_type;
  return menuItemsMap[_type] || [];
});
</script>

<style lang="scss" scoped></style>
