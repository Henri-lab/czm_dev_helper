import vue from "@vitejs/plugin-vue";

export const useVuePlugin = () => {
    return [vue()];
};
// # @vitejs/plugin-vue 配置

// `@vitejs/plugin-vue` 是 Vite 的官方 Vue3 插件，用于处理 `.vue` 单文件组件。以下是一些可用的配置选项：

// ### 配置选项

// 1. **`include`**:
//    - 类型: 正则表达式或数组
//    - 描述: 定义哪些文件应该被此插件处理。默认情况下，所有 `.vue` 文件都会被处理。
//    - 示例:
//      ```javascript
//      include: [/\.vue$/, /\.md$/],
//      ```

// 2. **`exclude`**:
//    - 类型: 正则表达式或数组
//    - 描述: 定义哪些文件不应该被此插件处理。
//    - 示例:
//      ```javascript
//      exclude: /node_modules/,
//      ```

// 3. **`transformAssetUrls`**:
//    - 类型: 对象
//    - 描述: 控制如何转换 `<img>`、`<a>` 等标签中的 URL。
//    - 示例:
//      ```javascript
//      transformAssetUrls: {
//        base: null, // 或者 "http://example.com"
//        includeAbsolute: false,
//      },
//      ```

// 4. **`template`**:
//    - 类型: 对象
//    - 描述: 配置 `.vue` 文件中的模板编译选项。
//    - 示例:
//      ```javascript
//      template: {
//        compilerOptions: {
//          // 编译器选项
//          whitespace: 'preserve',
//        },
//      },
//      ```

// 5. **`jsx`**:
//    - 类型: 布尔值
//    - 描述: 启用或禁用 JSX 支持。
//    - 示例:
//      ```javascript
//      jsx: true,
//      ```

// 6. **`reactivityTransform`**:
//    - 类型: 布尔值
//    - 描述: 启用或禁用对 `.vue` 文件中的 `<script setup>` 块进行响应式转换。
//    - 示例:
//      ```javascript
//      reactivityTransform: true,
//      ```

// ### 示例配置

// ```javascript
// import vue from '@vitejs/plugin-vue';

// export default {
//   plugins: [
//     vue({
//       include: [/\.vue$/, /\.md$/],
//       reactivityTransform: true,
//       // 其他配置...
//     }),
//   ],
// };