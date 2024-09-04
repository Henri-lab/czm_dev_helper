<!-- 给其他组件分发视图的管理者 -->
<template>
  <div class="czm-helper">



  </div>
</template>

<script setup>
import { ref, computed, watchEffect, provide } from 'vue';
import { defineStore } from 'pinia'
import czmHelper from '../_lib';

let useStore = defineStore('default', {
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
provide('$store', $store)

// 分发管理者
let currentViewer = null;
let viewerHistory = new Set([]);
let managerModule = czmHelper.ManagerModule;
let dataProcesser = new czmHelper.DataModule.DataPrepocesser()
watchEffect(() => {
  const $viewer = $store.Viewer;
  viewerHistory.add($viewer);
  if (!$viewer || $viewer === currentViewer) return;
  currentViewer = $viewer; // 保存当前的 viewer
  if (!$viewer) return;
  let SceneManager = new managerModule.SceneManager($viewer);
  let CameraManager = new managerModule.CameraManager($viewer);
  let EventManager = new managerModule.EventManager($viewer);
  let DrawingManager = new managerModule.DrawingManager($viewer);
  let ConfigManager = new managerModule.ConfigManager($viewer);
  provide('$viewer', $viewer);
  provide('SceneManager', ref(SceneManager));
  provide('CameraManager', ref(CameraManager));
  provide('EventManager', ref(EventManager));
  provide('DrawingManager', ref(DrawingManager));
  provide('DataProcesser', ref(dataProcesser));
  provide('ConfigManager', ref(ConfigManager));
});

</script>
