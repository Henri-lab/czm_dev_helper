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
import { consolePlugin1 } from './plugins/consolePlugin'

const app = createApp(App);

app.use(createPinia())
    .use(router)
    .use(cvp)
    .use(Antd)
    .use(VScaleScreen)
    .use(consolePlugin1)
    .mount('#app')

export default app