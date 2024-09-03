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
import * as Cesium from 'cesium';
import subMenuL2 from './subMenu/L2.vue';
import useCzmHelper from '@/hook/useCzmHelper.vue';
import { lineOpt } from '@czmHelper/Editor/config/lineOpt';
import useDefaultStore from '@/store';
import bus from '@/util/bus';

const naviSideKeys = ref([]); //sub-menu-item-key
const openKeys = ref([]); //sub-menu-key
const czmhelper = ref(null);

const defaultStore = useDefaultStore();
const setMap = defaultStore.setMap;

// 菜单选项编码 a-1 语义化

const menuNameKeys = {
  pencil: 'a-1', //第一栏的第一项
  material: 'b-1',
  scene: 'c-1',
  source_mono: 'd-1',
  source_3dtiles: 'd-2',
  source_gltf: 'd-3',
  tool: 'e-1',
  three: 'f-1',
  user: 'g-1',
}



// 侧边导航菜单项的监听
watch(
  () => naviSideKeys.value,
  (newSideKey) => {
    const curKey = newSideKey[0];
    // 菜单项的执行
    Object.keys(menuNameKeys).forEach((name) => {
      if (menuNameKeys[name] === curKey) {
        handleItemClick(curKey)
      }
    });
  }
);
// watch(() => openKeys.value,
//   (newValue) => {
//     console.log(newValue)
//   })
// 菜单项的执行
function handleItemClick(itemKey) {
  console.log(itemKey);
  if (itemKey === menuNameKeys['pencil']) {
    //画笔测试 打开画笔面板
    bus.emit('panel_draw_showToggle');
  }
  //加载视图资源（以wuhan白膜为例）
  else if (itemKey === menuNameKeys['source_mono']) {
    setMap('wuhan-123');
  }
  else if (itemKey === menuNameKeys['source_3dtiles']) {
    //加载模型
    const tileOpt = {
      url: '/src/mock/3dtiles/Tile_+002_+005/tileset.json',
    };
    czmhelper.value?.add3DModel('3dtiles', tileOpt);
  }
  else if (itemKey === menuNameKeys['source_gltf']) {
    const gltfOpt = {
      url: '/src/mock/metro.gltf',
      modelMatrix: Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0.0, 0.0, 0.0)),
      scale: 1.0
    }
    czmhelper.value?.add3DModel('gltf', gltfOpt);

  }
}

</script>

<style lang="scss" scoped></style>
