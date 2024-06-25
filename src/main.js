import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import {createPinia} from 'pinia'
import router from './router'
import VScaleScreen from 'v-scale-screen'
import './style.scss'

const app = createApp(App);

app.use(Antd).use(createPinia()).use(router).use(VScaleScreen).mount('#app')

export default app