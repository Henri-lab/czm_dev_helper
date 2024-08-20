// // 确保你的tsconfig.json配置文件包含这个新创建的类型声明文件。如果它位于src目录下，通常不需要额外配置，因为tsconfig.json默认会包含这个目录下的所有类型声明文件(anyname.d.ts)。
declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}