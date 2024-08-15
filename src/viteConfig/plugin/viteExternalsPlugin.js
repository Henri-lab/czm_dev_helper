
import { viteExternalsPlugin } from "vite-plugin-externals";

export const useViteExternalsPlugin = () => {
    return [viteExternalsPlugin(
        {
            cesium: "Cesium", // 外部化 cesium 依赖，之后全局访问形式是 window['Cesium']
        },
        {
            disableInServe: true //开发环境不启用外部化
        }
    )
    ]

}
// # vite-plugin-externals 配置

// `vite-plugin-externals` 是一个 Vite 插件，用于将某些模块声明为外部依赖，从而不打包这些模块，
// 而是让运行环境去查找它们。这通常用于减少构建包的大小，特别是在使用大型第三方库时。

// ## 配置选项

// 1. **`externals`**:
//    - 类型: 对象
//    - 描述: 指定哪些模块应该作为外部依赖。键是模块名称，值是浏览器环境中对应的全局变量名。
//    - 示例:
//      ```javascript
//      externals: {
//        lodash: 'lodash',
//        vue: 'Vue',
//      },
//      ```

// 2. **`globalNames`** (可选):
//    - 类型: 字符串或函数
//    - 描述: 如果提供的 `externals` 中没有指定全局变量名，则使用此选项作为默认全局变量名。
//    - 示例:
//      ```javascript
//      globalNames: 'defaultGlobalName',
//      ```

// 3. **`onwarn`** (可选):
//    - 类型: 函数
//    - 描述: 自定义警告处理器，当 Vite 发出警告时调用。
//    - 示例:
//      ```javascript
//      onwarn: (warning, handler) => {
//        if (warning.code === 'UNUSED_EXTERNAL') {
//          console.log(`Unused external: ${warning.message}`);
//        } else {
//          handler(warning);
//        }
//      },
//      ```

// 4. **`dts`** (可选):
//    - 类型: 字符串路径
//    - 描述: 指定 `.d.ts` 文件的路径，用于生成类型声明文件。
//    - 示例:
//      ```javascript
//      dts: './src/externals.d.ts',
//      ```

// ## 示例配置

// ```javascript
// import { viteExternalsPlugin } from "vite-plugin-externals";

// export default {
//   plugins: [
//     viteExternalsPlugin({
//       externals: {
//         lodash: 'lodash',
//         vue: 'Vue',
//       },
//       globalNames: 'defaultGlobalName',
//       onwarn: (warning, handler) => {
//         if (warning.code === 'UNUSED_EXTERNAL') {
//           console.log(`Unused external: ${warning.message}`);
//         } else {
//           handler(warning);
//         }
//       },
//       dts: './src/externals.d.ts',
//     }),
//   ],
// };