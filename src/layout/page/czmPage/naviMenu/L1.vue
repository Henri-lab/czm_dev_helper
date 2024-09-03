<template>
  <!-- hook -->
  <useCzmHelper ref="czmhelper" />
  <!-- 菜单 -->
  <a-menu v-model:selectedKeys="naviSideKeys" v-model:openKeys="openKeys" mode="inline" style="height: 100%">
    <!-- 子菜单 -->
    <subMenuL2></subMenuL2>
  </a-menu>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import subMenuL2 from './subMenu/L2.vue';
import useCzmHelper from '@/hook/useCzmHelper.vue';
import { lineOpt } from '@czmHelper/Editor/config/lineOpt';
import useDefaultStore from '@/store';

const naviSideKeys = ref([]); //sub-menu-item-key
const openKeys = ref([]); //sub-menu-key
const czmhelper = ref(null);

const defaultStore = useDefaultStore();
const setMap = defaultStore.setMap;

// 菜单选项编码 a-1 语义化
const pencil = 'a-1'; //第一栏的第一项
const material = 'b-1';
const scene = 'c-1';
const source_mono = 'd-1';
const source_3dtiles = 'd-2';
const source_gltf = 'd-3';
const tool = 'e-1';
const three = 'f-1';
const user = 'g-1';



// 侧边导航菜单项的监听
watch(
  () => naviSideKeys.value,
  (newValue) => {
    // 菜单项的执行
    const logMap = {
      [pencil]: () => handleItemClick(pencil), //画笔测试
      [material]: () => handleItemClick(material),
      [scene]: () => handleItemClick(scene),
      [source_mono]: () => handleItemClick(source_mono),
      [source_3dtiles]: () => handleItemClick(source_3dtiles),
      [source_gltf]: () => handleItemClick(source_gltf),
      [tool]: () => handleItemClick(tool),
      [three]: () => handleItemClick(three),
      [user]: () => handleItemClick(user),
    };

    logMap[newValue[0]]?.();
  }
);
// watch(() => openKeys.value,
//   (newValue) => {
//     console.log(newValue)
//   })
// 菜单项的执行
function handleItemClick(itemKey) {
  console.log(itemKey);
  if (itemKey === pencil) {
    //画笔测试
    czmhelper.value?.startLine(lineOpt);
  }
  //加载视图资源（以wuhan白膜为例）
  else if (itemKey === source_mono) {
    setMap('wuhan-123');
  }
  else if (itemKey === source_3dtiles) {
    //加载模型
    const tileOpt = {
      url: '/src/mock/3dtiles/Tile_+002_+005/tileset.json',
    };
    czmhelper.value?.add3DModel('3dtiles', tileOpt);
  }
  else if (itemKey === source_gltf) {
    const gltfOpt = {
      url: '/src/mock/metro.gltf',
    }
    czmhelper.value?.add3DModel('gltf', gltfOpt);
  }
}

</script>

<style lang="scss" scoped></style>
