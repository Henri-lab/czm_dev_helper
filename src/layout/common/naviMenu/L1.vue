<template>
  <!-- hook -->
  <ViewerManager ref="viewerManagerRef" />
  <!-- 菜单 -->
  <a-menu
    v-model:selectedKeys="naviSideKeys"
    v-model:openKeys="openKeys"
    mode="inline"
    style="height: 100%"
  >
    <!-- 子菜单 -->
    <subMenuL2></subMenuL2>
  </a-menu>
</template>

<script setup>
import { ref, watch } from 'vue';
import subMenuL2 from './subMenu/L2.vue';
import ViewerManager from '../../../hook/useManager.vue';
import {
  MENU_ITEM_KEY_Map as itemKEY,
  MENU_ITEM_TITLE_CN_Map as CN,
} from '../naviMenu/subItem/enums';
import { lineOpt } from '../../../cesium_dev_helper/_lib/Editor/config/lineOpt';
import { useCommonStore } from '../../../store';

const naviSideKeys = ref([]); //sub-menu-item-key
const openKeys = ref([]); //sub-menu-key
const viewerManagerRef = ref(null);

const commonStore = useCommonStore();
const setMap = commonStore.setMap;

// 菜单选项编码
const pencil = itemKEY[1]; //'pencil_test'
const material = itemKEY[2];
const scene = itemKEY[3];
const source = itemKEY[4];
const source_3dtiles = itemKEY[41];
const source_gltf = itemKEY[42];
const tool = itemKEY[5];
const three = itemKEY[6];
const user = itemKEY[7];

// 侧边导航菜单项的监听
watch(
  () => naviSideKeys.value,
  (newValue) => {
    // 菜单项的执行
    const logMap = {
      [pencil]: () => handleItemClick(pencil), //画笔测试
      [material]: () => handleItemClick(material),
      [scene]: () => handleItemClick(scene),
      [source]: () => handleItemClick(source),
      [source_3dtiles]: () => handleItemClick(source_3dtiles),
      [source_gltf]: () => handleItemClick(source_gltf),
      [tool]: () => handleItemClick(tool),
      [three]: () => handleItemClick(three),
      [user]: () => handleItemClick(user),
    };

    logMap[newValue[0]]?.();
  }
);

// 菜单项的执行
function handleItemClick(itemKey) {
  console.log(itemKey);
  if (itemKey === pencil) {
    //画笔测试
    viewerManagerRef.value?.startLine(lineOpt);
  }
  //加载视图资源（以wuhan白膜为例）
  if (itemKey === source) {
    setMap('wuhan');
  }
  if (itemKey === source_3dtiles) {
  }
}
</script>

<style lang="scss" scoped></style>
