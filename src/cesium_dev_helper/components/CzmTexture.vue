<!-- 给其他组件分发视图的管理者 -->
<template>
  <div class="czm-texture" ref="_czmCtx_">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, provide } from 'vue';
import { defineStore } from 'pinia'
import czmHelper from '../lib';
import mitt from 'mitt'
const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
})
// 分发管理者
let currentViewer = null;
let viewerHistory = new Set([]);
let managerModule = czmHelper.ManagerModule;
let dataProcesser = new czmHelper.DataModule.DataPrepocesser()

const $viewer = computed(() => {
  return $store.Viewer;
})
const $bus = mitt()
const _czmCtx_ = ref(null)
const sM = ref(null)
const cM = ref(null)
const eM = ref(null)
const dM = ref(null)
const dP = ref(null)
const cfgM = new managerModule.ConfigManager();
let useStore = defineStore('czmHelper', {
  state: () => {
    return {
      map: '', // name of map 
      mapInfo: {},
      viewer: null,
      editor: null,
      // 检测变化次数
      mapUpdatedCount: 0,
      viewerUpdatedCount: 0,
      editorUpdatedCount: 0,
    };
  },
  getters: {
    Map: state => state.map,
    MapInfo: state => state.mapInfo,
    Viewer: state => state.viewer,
    Editor: state => state.editor,
    MapUpdatedCount: state => state.mapUpdatedCount,
    ViewerUpdatedCount: state => state.viewerUpdatedCount,
    EditorUpdatedCount: state => state.editorUpdatedCount
  },
  actions: {
    setMap(type) {
      this.map = type;
      this.mapUpdatedCount++;
    },
    setViewer(viewer) {
      this.viewer = viewer;
      this.viewerUpdatedCount++;
    },
    setEditor(editor) {
      this.editor = editor;
      this.editorUpdatedd++;
    },
  }
});
let $store = useStore();


onMounted(() => {
  _czmCtx_.value.style.width = props.width;
  _czmCtx_.value.style.height = props.height;
})


watchEffect(() => {
  const $viewer = $store.Viewer;
  viewerHistory.add($viewer);
  if (!$viewer || $viewer === currentViewer) return;
  currentViewer = $viewer; // 保存当前的 viewer
  if (!$viewer) return;
  sM.value = new managerModule.SceneManager($viewer);
  cM.value = new managerModule.CameraManager($viewer);
  eM.value = new managerModule.EventManager($viewer);
  dM.value = new managerModule.DrawingManager($viewer);
});


onMounted(() => {
  console.log(import.meta.url, '<CzmTexture> mounted')
})

provide('$bus', $bus)
provide('$store', $store)
provide('$viewer', $viewer);
provide('SceneManager', sM);
provide('CameraManager', cM);
provide('EventManager', eM);
provide('DrawingManager', dM);
provide('DataProcesser', dP);
provide('ConfigManager', cfgM);
provide('DataProcesser', dataProcesser)
</script>

<style lang="scss" scoped>
.czm-helper {}
</style>
