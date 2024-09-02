<template>
  <!-- 菜单下拉选项 -->
  <a-menu-item class="subItem-L3" v-for="item in submenu_items" :key="item.key">
    {{ item.label }}
  </a-menu-item>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { getItemsByCode } from '../config';

// menu组件指定了submenu_items_type，根据该值获取菜单项
const props = defineProps({
  submenu_key: {
    type: String,
    required: true,
    // default: 'undefine',
  },
});
const _k = props.submenu_key;
// 菜单组名称-菜单项 映射表

// 根据submenu_items_type获取到的菜单项 + 性能考虑
const submenu_items = computed(() => {
  return getItemsByCode(_k) || [];
});
// const submenu_items = ref(getItemsByCode(_k))
onMounted(() => {
  console.log('submenu_items', submenu_items.value);
});   
</script>

<style lang="scss" scoped></style>
