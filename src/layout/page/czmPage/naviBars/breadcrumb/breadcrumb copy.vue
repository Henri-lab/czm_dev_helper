<template>
  <!-- 面包屑 -->
  <a-breadcrumb  class="app-breadcrumb" separator="/" style="margin: 16px 0">
    <a-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">{{ item }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  setup() {
    const breadcrumbItems = ref(['index', 'example', 'doc']);
    return {
      breadcrumbItems
    };
  }
};
// @tip
// ## 在 Vue 3 中使用 `setup` 语法糖给组件命名

// 在 Vue 3 中使用 `setup` 语法糖时，可以通过几种不同的方式来给组件命名：

// 1. ** 使用`defineOptions` 函数 **:
// 如果你想在 `setup` 语法糖中给组件命名，你可以使用 `defineOptions` 函数。这个函数允许你在组件内部声明一些元数据，比如组件的名字。

// ```vue
//    -script setup-
//    import { defineOptions } from 'vue';

//    defineOptions({
//      name: 'MyComponentName'
//    });
//    /script
// ```

// 如果你的项目使用 Vite 构建工具，你可以安装一个插件如 vite-plugin-vue-setup-extend 来扩展 script setup 的功能，使得可以在 script 标签内直接定义组件名称。
// vite.config.js
// import { defineConfig } from 'vite';
// import VueSetupExtend from 'vite-plugin-vue-setup-extend';

// export default defineConfig({
//   plugins: [
//     VueSetupExtend()
//   ]
// });

// 使用 -script setup- 内的 name 属性: 如果你使用的是 Vue 3.2.0 及以上版本，并且安装了支持 -script setup- 的构建工具插件（如 @vitejs/plugin-vue 或 vite-plugin-vue2），
// 则可以直接在<-script setup- 中使用 name 属性。
//  -script setup name="MyComponentName"-
// // 组件逻辑
// /-script-
</script>

  