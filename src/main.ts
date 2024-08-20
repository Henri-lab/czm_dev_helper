import { createApp, App as app } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
// micro
import { registerMicroApps, start } from 'qiankun';
// 插件
import extraPlugins from './plugins';
// UI
import Antd from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import 'ant-design-vue/dist/reset.css';
import ElementPlus from 'element-plus';
// import lang_zh_cn from 'element-plus/lib/locale/lang/zh-cn' // CN
import './assets/css/index.css';
import VScaleScreen from 'v-scale-screen'; //响应式
// 组件
import AppVue from './App.vue';
// 自定义指令 绑定
import directive from './directive';
// 通用
import Cookies from 'js-cookie';

const app = createApp(AppVue);

// 全局注册图标
app.component('PlusOutlined', PlusOutlined);

app
  .use(createPinia())
  .use(router)
  //----------
  .use({
    install: (app: app): void => {
      app.component('VScaleScreen', VScaleScreen);
    },
  })
  .use(Antd)
  .use(ElementPlus, {
    // locale: lang_zh_cn,
    size: asSize(Cookies.get('size') || 'default'),
  })
  .use(extraPlugins);

// 注册自定义指令
directive(app);

app.mount('#app');

// ------------------------------------------------------------------------------------------------------------------------------------------
// 频繁地进行读取操作，可以通过设置 willReadFrequently 属性来提高性能。
// --频繁读取图像数据：如果你的应用程序频繁调用 getImageData 方法（例如，每帧都需要读取像素数据），设置 willReadFrequently 可以显著提高性能。
// --实时图像处理：在进行实时图像处理或需要频繁读取像素数据的应用中（如游戏、实时特效），这个选项是非常有用的。
// 获取 Canvas 元素
let canvasArr = document.querySelectorAll('canvas');
canvasArr.forEach((canvas) => {
  let context = canvas.getContext('2d', { willReadFrequently: true });
  if (context)
    // 可以频繁地使用 getImageData 而不会有性能问题啦 👍
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
});

// ------------------------------------------------------------------------------------------------------------------------------------------
// SizeType 类型定义
type SizeType = '' | 'default' | 'small' | 'large';
// 假设allowedSizes是一个枚举或者常量数组，包含了所有允许的SizeType
const allowedSizes: SizeType[] = ['', 'default', 'small', 'large'];
function asSize(size: string): SizeType {
  // 使用类型断言确保传入的字符串是SizeType类型之一
  if (allowedSizes.includes(size as SizeType)) {
    return size as SizeType;
  } else {
    return 'default' as SizeType; // 返回默认值，并且确保返回值类型正确
  }
}
// ------------------------------------------------------------------------------------------------------------------------------------------

export default app;
