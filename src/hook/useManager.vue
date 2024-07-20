<!-- 给其他组件分发视图的管理者 -->
<template>
  <div></div>
</template>

<script setup>
// editorRef: 使用 ref 创建一个响应式引用来存储 editor。
// watchEffect: 监视 commonStore.Editor 的变化并更新 editorRef 的值。
// useEditor: 返回一个 computed 引用，每次调用时都会计算并返回最新的 editor 实例。
// startLine: 确保在调用 editor.startLine() 前 editor 存在。
// 通过这种方式，useEditor 始终返回最新的 editor 实例，并且由于 editorRef 是响应式的，computed 将确保每次获取的都是最新的 editor。
import { ref, computed, watchEffect } from 'vue';
import { useCommonStore } from '@/store';
import czmHelper from '../cesium_dev_helper/_lib';

const commonStore = useCommonStore();
const managerModule = czmHelper.ManagerModule;

// 分发管理者
let $viewer = computed(() => commonStore.Viewer);
let SceneManagerRef = ref(null);
let CameraManagerRef = ref(null);
let EventManagerRef = ref(null);
watchEffect(() => {
  const _viewer = commonStore.Viewer;
  SceneManagerRef.value = new managerModule.SceneManager(_viewer);
  CameraManagerRef.value = new managerModule.CameraManager(_viewer);
  EventManagerRef.value = new managerModule.EventManager(_viewer);
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







// -----------------------------------------------------------------------------
// 分发图形编辑器
const editorRef = ref(null);
watchEffect(() => {
  const _editorFromStore = commonStore.Editor;
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
const startLine = () => {
  // 调用 editor 的 startLine 方法
  if (editorRef.value) {
    editorRef.value.startLine();
  }
};

defineExpose({
  getSceneManager,
  getCameraManager,
  getEventManager,
  getEditor,
  startLine,
});
</script>
