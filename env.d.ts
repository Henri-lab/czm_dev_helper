// */env.d.ts
declare module 'global' {
  // 这里放置你想要增强全局作用域的内容
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  interface ImportMetaEnv {
    readonly VITE_CESIUM_KEY: string;
  }
}
