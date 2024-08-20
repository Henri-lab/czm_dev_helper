import * as echarts from 'echarts';

export const echartsPlugin = {
    install(app) {
        app.config.globalProperties.$echarts = echarts;
    }
}