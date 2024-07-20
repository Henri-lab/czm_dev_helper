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

const commonStore = useCommonStore();

// 创建一个响应式的 ref 变量来存储 editor
const editorRef = ref(null);

// 监视 commonStore.Editor 的变化并更新 editorRef
watchEffect(() => {
  const _editorFromStore = commonStore.Editor;
  if (_editorFromStore) {
    editorRef.value = _editorFromStore;
  }
});

const getEditor = () => {
  // 返回一个 computed 引用，确保每次调用都返回最新的 editor
  return computed(() => editorRef.value);
};

const startLine = () => {
  // 调用 editor 的 startLine 方法
  if (editorRef.value) {
    editorRef.value.startLine();
  }
};
defineExpose({
  getEditor,
  startLine,
});
</script>
