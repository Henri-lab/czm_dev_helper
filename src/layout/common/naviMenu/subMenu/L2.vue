<template>
  <!-- 子菜单 -->
  <a-sub-menu v-for="submenu in subMenus" :key="submenu.key">
    <template #title>
      <span>
        <component :is="submenu.icon" />
        {{ submenu.title }}
      </span>
    </template>
    <!-- 选项 -->
    <subItemL3 :submenu_items_type="submenu.type"></subItemL3>
  </a-sub-menu>
</template>

<script setup>
import { MENUTYPE, MENUTITLE } from './enums';
import subItemL3 from '../subItem/L3.vue';
// 侧边导航栏
const subMenus = [
  {
    key: 'sub1',
    title: MENUTITLE.pencil,
    type: MENUTYPE.pencil,
    // icon: UserOutlined,
  },
  {
    key: 'sub2',
    title: MENUTITLE.material,
    type: MENUTYPE.material,
  },
  {
    key: 'sub3',
    title: MENUTITLE.scene,
    type: MENUTYPE.scene,
  },
  {
    key: 'sub4',
    title: MENUTITLE.source,
    type: MENUTYPE.source,
  },
  {
    key: 'sub5',
    title: MENUTITLE.tool,
    type: MENUTYPE.tool,
  },
  {
    key: 'sub6',
    title: MENUTITLE.three,
    type: MENUTYPE.three,
  },
  {
    key: 'sub7',
    title: MENUTITLE.user,
    type: MENUTYPE.user,
  },
];
</script>

<style lang="scss" scoped></style>
