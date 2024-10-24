// 确保你的tsconfig.json配置文件包含这个新创建的类型声明文件。如果它位于src目录下，通常不需要额外配置，因为tsconfig.json默认会包含这个目录下的所有类型声明文件(anyname.d.ts)。
declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}





interface Window {
  CESIUM_BASE_URL: string;
}
interface ImportMeta {
  env: {
    VITE_CESIUM_KEY: string;
    VITE_GAODE_Key: string;
    VITE_CESIUM_BASE_URL: any;
    VITE_CESIUM_KEY: string;
    VITE_APP_BASE_API: string;
  };
}
