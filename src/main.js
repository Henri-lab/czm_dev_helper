import { createApp, inject, provide } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import VScaleScreen from 'v-scale-screen'
import './style.scss'
import { PlusOutlined } from '@ant-design/icons-vue';

const app = createApp(App);
// 全局注册图标
app.component('PlusOutlined', PlusOutlined);

app.use(createPinia())
    .use(router)
    .use(Antd)
    .use(VScaleScreen);

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

// console.log('main')
export default app

