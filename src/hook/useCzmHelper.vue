<!-- 给其他组件分发视图的管理者 -->
<template>
  <div></div>
</template>

<script setup>
// editorRef: 使用 ref 创建一个响应式引用来存储 editor。
// watchEffect: 监视 defaultStore.Editor 的变化并更新 editorRef 的值。
// useEditor: 返回一个 computed 引用，每次调用时都会计算并返回最新的 editor 实例。
// startLine: 确保在调用 editor.startLine() 前 editor 存在。
// 通过这种方式，useEditor 始终返回最新的 editor 实例，并且由于 editorRef 是响应式的，computed 将确保每次获取的都是最新的 editor。
import { ref, computed, watchEffect } from 'vue';
import useDefaultStore from '@/store';
import czmHelper from '@czmHelper';


const defaultStore = useDefaultStore();
const setMap = defaultStore.setMap;
const managerModule = czmHelper.ManagerModule;
const DataPrepocesser = czmHelper.DataModule.DataPrepocesser;

// 分发管理者
let $viewer = computed(() => defaultStore.Viewer);
let SceneManagerRef = ref(null);
let CameraManagerRef = ref(null);
let EventManagerRef = ref(null);
let DrawManagerRef = ref(null);
watchEffect(() => {
  const _viewer = defaultStore.Viewer;
  if (!_viewer) return;
  SceneManagerRef.value = new managerModule.SceneManager(_viewer);
  CameraManagerRef.value = new managerModule.CameraManager(_viewer);
  EventManagerRef.value = new managerModule.EventManager(_viewer);
  DrawManagerRef.value = new managerModule.DrawingManager(_viewer);
});
const getSceneManager = () => {
  return computed(() => SceneManagerRef.value);
  // return SceneManagerRef;
};
const getCameraManager = () => {
  return computed(() => CameraManagerRef.value);
  // return CameraManagerRef;
};
const getEventManager = () => {
  return computed(() => EventManagerRef.value);
  // return EventManagerRef;
};
const getDrawingManager = () => {
  return computed(() => DrawManagerRef.value);
  // return DrawManagerRef;
};
const initScene = (options) => {
  SceneManagerRef.value?.initScene(options);
};
const add3DModel = (type, options, extraOpt) => {
  const cb_setClampToGround = (resArr) => {
    const tile = resArr[0].model; //💢
    const maxtrixOpt = {
      tx: 0,
      ty: 0,
      tz: -70,
      rx: 0,
      ry: 0,
      rz: 0,
      scale: 1.3,
    };
    if (type == '3dtiles')
      DataPrepocesser.update3DtilesMaxtrix(tile, maxtrixOpt);
  };
  SceneManagerRef.value?.add3DModel(
    type,
    options,
    cb_setClampToGround,
    extraOpt
  );
};

// ---管理者的工具-------------------------------------------------------------------------
// 分发图形编辑器(后续打算放在drawing-manager身上)
const editorRef = ref(null);
watchEffect(() => {
  const _editorFromStore = defaultStore.Editor;
  if (_editorFromStore) {
    editorRef.value = _editorFromStore;
  }
});
const getEditor = () => {
  // 直接返回 ref 时，你需要在使用的时候访问 ref.value。📍
  // 而返回 computed 包裹的 ref.value 可以简化使用，避免显式地调用 value。📍
  // 两种方法性能接近
  return computed(() => editorRef.value);
};
const startLine = (options) => {
  // 调用 editor 的 startLine 方法
  if (editorRef.value) {
    editorRef.value.startLine(options);
  }
};

defineExpose({
  getSceneManager,
  getCameraManager,
  getEventManager,
  getDrawingManager,
  getEditor,
  initScene,
  add3DModel,
  startLine,
  setMap,
  $viewer,
});
</script>
