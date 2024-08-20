
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueECharts from 'vue-echarts';
import { echartsPlugin } from './plugin/echarts';
import './main.css'
import 'animate.css'




import App from './App.vue'
import router from './router'

export const app = createApp(App)

app.component('v-chart', VueECharts);

app.use(createPinia())
app.use(router)
app.use(echartsPlugin)

app.provide('app', app)

app.mount('#app')

// test

