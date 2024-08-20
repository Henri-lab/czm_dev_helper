import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
// 插件
import extraPlugins from './plugins';
// UI
import Antd from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import 'ant-design-vue/dist/reset.css';
import ElementPlus from 'element-plus';
// import lang_zh_cn from 'element-plus/lib/locale/lang/zh-cn' // CN
import './assets/css/index.css'
import VScaleScreen from 'v-scale-screen'//响应式
// 组件
import App from './App.vue'
// 自定义指令 绑定
import directive from './directive';
// 通用
import Cookies from 'js-cookie'

const app = createApp(App);
// 全局注册图标
app.component('PlusOutlined', PlusOutlined);

app.use(createPinia())
    .use(router)
    .use(VScaleScreen)
    .use(Antd)
    .use(ElementPlus, {
        // locale: lang_zh_cn,
        size: Cookies.get('size') || 'default'
    })
    .use(extraPlugins)

// 注册自定义指令
directive(app);

app.mount('#app')





//偷个懒 👀

// 频繁地进行读取操作，可以通过设置 willReadFrequently 属性来提高性能。
// --频繁读取图像数据：如果你的应用程序频繁调用 getImageData 方法（例如，每帧都需要读取像素数据），设置 willReadFrequently 可以显著提高性能。
// --实时图像处理：在进行实时图像处理或需要频繁读取像素数据的应用中（如游戏、实时特效），这个选项是非常有用的。
// 获取 Canvas 元素
let canvasArr = document.querySelectorAll('canvas');
canvasArr.forEach(canvas => {
    let context = canvas.getContext('2d', { willReadFrequently: true });
    if (context)
        // 可以频繁地使用 getImageData 而不会有性能问题啦 👍
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
})






export default app

// 根目录同时有mainTS和mainJS 该怎么配置告诉执行哪个
// ChatGPT said:
// ChatGPT
// 在项目的根目录中同时存在 main.ts 和 main.js 文件时，你需要告诉构建工具（如 Vite、Webpack 等）以及 TypeScript 或 Node.js 应该使用哪个文件作为入口。这通常通过配置文件来实现，具体步骤取决于你使用的工具或框架。以下是几种常见的配置方法：

// 1. Vite 项目
// 如果你使用 Vite，可以通过 vite.config.ts 文件来指定入口文件。

// typescript
// Copy code
// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';

// export default defineConfig({
//   plugins: [vue()],
//   build: {
//     rollupOptions: {
//       input: './src/main.ts', // 指定使用 main.ts 作为入口
//     }
//   }
// });
// 2. Webpack 项目
// 在 Webpack 中，你可以通过 webpack.config.js 来指定入口文件。

// javascript
// Copy code
// const path = require('path');

// module.exports = {
//   entry: './src/main.ts', // 指定使用 main.ts 作为入口
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist')
//   },
//   resolve: {
//     extensions: ['.ts', '.js']
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         use: 'ts-loader',
//         exclude: /node_modules/
//       }
//     ]
//   }
// };
// 3. TypeScript 配置 (tsconfig.json)
// 在 TypeScript 配置文件 tsconfig.json 中，虽然不能直接指定入口文件，但可以通过 include 和 exclude 配置文件的编译范围，确保只编译 main.ts：

// json
// Copy code
// {
//   "compilerOptions": {
//     "target": "esnext",
//     "module": "esnext",
//     "moduleResolution": "node",
//     "strict": true,
//     "jsx": "preserve",
//     "esModuleInterop": true,
//     "skipLibCheck": true,
//     "allowSyntheticDefaultImports": true,
//     "forceConsistentCasingInFileNames": true,
//     "resolveJsonModule": true,
//     "isolatedModules": true,
//     "noEmit": true
//   },
//   "include": [
//     "src/main.ts", // 仅包含 main.ts
//     "src/**/*.ts",
//     "src/**/*.vue"
//   ],
//   "exclude": [
//     "node_modules",
//     "src/main.js" // 排除 main.js
//   ]
// }
// 4. package.json 的 main 字段
// 在一些情况下，你可以通过 package.json 文件中的 main 字段来指定默认的入口文件。这通常用于 Node.js 项目或打包发布的库。

// json
// Copy code
// {
//   "main": "src/main.ts" // 设定主入口文件为 main.ts
// }
// 5. Node.js 项目
// 如果你的项目使用 Node.js，可以在启动命令中指定入口文件。例如：

// bash
// Copy code
// node src/main.ts
// 或者在 package.json 中指定启动脚本：

// json
// Copy code
// {
//   "scripts": {
//     "start": "node src/main.ts"
//   }
// }
// 6. 直接修改文件名
// 如果没有特殊需要同时保留两个入口文件，可以考虑将不使用的文件重命名或移动到其他目录，以避免冲突。

// 7. VSCode 配置
// 在 VSCode 中，如果你需要指定调试时使用的入口文件，可以通过 .vscode/launch.json 来配置。

// json
// Copy code
// {
//   "version": "0.2.0",
//   "configurations": [
//     {
//       "type": "node",
//       "request": "launch",
//       "name": "Launch Program",
//       "program": "${workspaceFolder}/src/main.ts", // 指定使用 main.ts
//       "preLaunchTask": "tsc: build - tsconfig.json",
//       "outFiles": ["${workspaceFolder}/dist/**/*.js"]
//     }
//   ]
// }
// 这些方法应该能帮助你明确指定入口文件，避免项目构建或运行时的混淆和冲突。