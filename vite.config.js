
import { defineConfig, loadEnv } from "vite";
import { usePlugins } from "./src/viteConfig/plugin";
import { cssOption } from "./src/viteConfig/css";
import { resolveOption } from './src/viteConfig/resolve'
import { serverOption } from './src/viteConfig/server'

const config = (context) => {
  // 获取 构建模式
  const mode = context.mode;
  const isProd = mode === "production";//是否是生产模式
  // 获取 环境变量
  const envDir = "env"; // 环境变量文件的文件夹，相对于项目的路径，也可以用 nodejs 函数拼接绝对路径
  const env = loadEnv(mode, envDir); console.log(env); /* 打印环境变量设置 */
  const base = env.VITE_APP_ENV === "production" ? "/" : "/";
  // 获得 Vite插件
  // 1. 使用vite-plugin-externals插件将cesium文件外部化
  // 2. 使用vite-plugin-insert-html插件在index.html中实现自动引入
  // 3. 使用viteStaticCopy插件将cesium文件从node_modules下拷贝出来
  // 4. 使用vite-plugin-compression插件对大文件进行进一步压缩
  // 5. 使用vite-plugin-glsl加载本地glsl文件 会忽略注释
  const plugins = usePlugins({ isProd });
  // 获得 解析器配置
  const resolve = resolveOption;
  // 获得 CSS处理器配置
  const css = cssOption;
  // 获得 开发服务器配置
  const server = serverOption;

  return {
    mode,
    envDir,
    base,
    plugins,
    resolve,
    css,
    server
  }
};


// https://vitejs.dev/config/
export default defineConfig(config);