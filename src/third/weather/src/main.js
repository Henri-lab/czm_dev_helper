
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueECharts from 'vue-echarts';
import { echartsPlugin } from './plugin/echarts';
import './main.css'
import 'animate.css'
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper';




// micro 子应用 child-app-weather
let child_app = null;

function render(props) {
    const child_app = createApp(App)
    child_app.component('v-chart', VueECharts);
    child_app.use(createPinia())
    child_app.use(router)
    child_app.use(echartsPlugin)
    child_app.provide(props.container || '#app', child_app)
    child_app.mount(props.container || '#app')
}

renderWithQiankun({
    bootstrap: () => { },
    mount(props) {
        render(props);
    },
    unmount: () => {
        if (child_app) {
            child_app.unmount();
        }
    },
    update: (props) => {
        console.log('update props', props);
    },
});

if (!window.__POWERED_BY_QIANKUN__) {
    render();
}

// test

