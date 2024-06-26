import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import VScaleScreen from 'v-scale-screen'
import './style.scss'

// 初始化czm viewer
import cvp from './plugins/czmViewPlugin'

const app = createApp(App);

app.use(createPinia())
    .use(router)
    .use(cvp)
    .use(Antd)
    .use(VScaleScreen)
    .mount('#app')

export default app