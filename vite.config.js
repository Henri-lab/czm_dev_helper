// 1. 使用vite-plugin-externals插件将cesium文件外部化
// 2. 使用vite-plugin-insert-html插件在index.html中实现自动引入
// 3. 使用viteStaticCopy插件将cesium文件从node_modules下拷贝出来
// 4. 使用vite-plugin-compression插件对大文件进行进一步压缩
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "url";
import vue from "@vitejs/plugin-vue";
import { viteExternalsPlugin } from "vite-plugin-externals";
import { insertHtml, h } from "vite-plugin-insert-html";
import { viteStaticCopy } from "vite-plugin-static-copy";
import compress from "vite-plugin-compression";

const config = (context) => {
  const mode = context.mode;
  const envDir = "env"; // 环境变量文件的文件夹，相对于项目的路径，也可以用 nodejs 函数拼接绝对路径
  const isProd = mode === "production";

  const env = loadEnv(mode, envDir);
  console.log(env);
  const cesiumBaseUrl = env["VITE_CESIUM_BASE_URL"];
  console.log(cesiumBaseUrl);
  // 默认 base 是 '/'
  const base = "/";
  const plugins = [
    vue(),
    viteExternalsPlugin(
      {
        cesium: "Cesium", // 外部化 cesium 依赖，之后全局访问形式是 window['Cesium']
      }, {
      disableInServe: true //开发环境不启用外部化
    }
    ),
    insertHtml({
      head: [
        // 生产模式使用 CDN 或已部署的 CesiumJS 在线库链接，开发模式用拷贝的库文件，根据 VITE_CESIUM_BASE_URL 自动拼接
        h("script", {
          // 因为涉及前端路径访问，所以开发模式最好显式拼接 base 路径，适配不同 base 路径的情况
          src: isProd
            ? `${cesiumBaseUrl}Cesium.js`
            : `${base}${cesiumBaseUrl}Cesium.js`,
        }),
        h("link", {
          rel: "stylesheet",
          href: isProd
            ? `${cesiumBaseUrl}Widgets/widgets.css`
            : `${base}${cesiumBaseUrl}Widgets/widgets.css`,
        }),
      ],
    }),
  ];
  if (!isProd) {
    // 开发模式，复制 node_modules 下的 cesium 依赖
    const cesiumLibraryRoot = "node_modules/cesium/Build/CesiumUnminified/";
    const cesiumLibraryCopyToRootPath = "libs/cesium/"; // 相对于打包后的路径
    const cesiumStaticSourceCopyOptions = [
      "Assets",
      "ThirdParty",
      "Workers",
      "Widgets",
    ].map((dirName) => {
      return {
        src: `${cesiumLibraryRoot}${dirName}/*`, // 注意后面的 * 字符，文件夹全量复制
        dest: `${cesiumLibraryCopyToRootPath}${dirName}`,
      };
    });
    plugins.push(
      viteStaticCopy({
        targets: [
          // 主库文件，开发时选用非压缩版的 IIFE 格式主库文件
          {
            src: `${cesiumLibraryRoot}Cesium.js`,
            dest: cesiumLibraryCopyToRootPath,
          },
          // 四大静态文件夹
          ...cesiumStaticSourceCopyOptions,
        ],
      })
    );
  }
  plugins.push(compress({
    threshold: 10 * 1024 // 10KB 以下不压缩
  }))
  const resolve = {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  }
  const css = {
    // css预处理器
    preprocessorOptions: {
      scss: {
        // 引入 mixin.scss 这样就可以在全局中使用 mixin.scss中预定义的变量了
        // 给导入的路径最后加上 ;
        additionalData: '@import "@/assets/style/mixin.scss";',
      },
    }
  }
  return {
    base,
    envDir,
    mode,
    plugins,
    resolve,
    css
  }
};

// https://vitejs.dev/config/
export default defineConfig(config);
