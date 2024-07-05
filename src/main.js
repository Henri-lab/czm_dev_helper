import { createApp, inject, provide } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import VScaleScreen from 'v-scale-screen'
import './style.scss'

const app = createApp(App);

app.use(createPinia())
    .use(router)
    .use(Antd)
    .use(VScaleScreen);

app.mount('#app')


// console.log('main')
export default app

