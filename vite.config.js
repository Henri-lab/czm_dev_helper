// 1. 使用vite-plugin-externals插件将cesium文件外部化
// 2. 使用vite-plugin-insert-html插件在index.html中实现自动引入
// 3. 使用viteStaticCopy插件将cesium文件从node_modules下拷贝出来
// 4. 使用vite-plugin-compression插件对大文件进行进一步压缩
// 5. 使用vite-plugin-glsl加载本地glsl文件 会忽略注释
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "url";
import { viteStaticCopy } from "vite-plugin-static-copy";
import compress from "vite-plugin-compression";
import { usePlugins } from "./src/viteConfig/plugin";




const config = (context) => {
  const base = "/";

  const mode = context.mode;
  const envDir = "env"; // 环境变量文件的文件夹，相对于项目的路径，也可以用 nodejs 函数拼接绝对路径
  const env = loadEnv(mode, envDir);
  const cesiumBaseUrl = env.VITE_CESIUM_BASE_URL;
  console.log(env);//方便查看环境变量

  const isProd = mode === "production";//是否是生产模式
  const plugins = usePlugins();
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
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],//扩展名自动补全 优先级依次递减
  }

  const css = {
    // css预处理器
    preprocessorOptions: {
      scss: {
        // 引入 mixin.scss 这样就可以在全局中使用 mixin.scss中预定义的变量了
        // 给导入的路径最后加上 ;
        additionalData: '@import "@/assets/style/mixin.scss";',
      },
    },
    // css后处理器
    postcss: {
      plugins: [
        {
          postcssPlugin: "internal:charset-removal",
          AtRule: {// 删除css中的@charset规则 
            charset: (atRule) => {
              if (atRule.name === "charset") {
                atRule.remove();
              }
            },
          },
        },
      ],
    },
  }

  const server = {
    port: 9000,
    host: true,
    open: true,
    proxy: {
      "/dev": {
        target: "http://192.168.3.194:6020",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev/, ''),
      },
    },
  }

  return {
    base,
    envDir,
    mode,
    plugins,
    resolve,
    css,
    server
  }
};


// https://vitejs.dev/config/
export default defineConfig(config);