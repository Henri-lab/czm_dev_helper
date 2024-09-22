<template></template>
<script setup>
import { inject } from 'vue';
import { PopupCreator } from '../../lib/Creator';

const props = defineProps({
    options: {
        type: Object,
        default: () => ({
            position: Cesium.Cartesian3.fromDegrees(120.0, 30.0), // 指定位置
            label: 'My Popup',  // 弹窗的标签
            isShow: true,       // 是否显示
            color: '#00ff00',   // 弹窗的颜色
            fields: ['Name', 'Value'], // 表单字段
            values: ['John', 'Doe'],   // 对应字段的值
            scaleByDistance: new Cesium.NearFarScalar(1000, 1, 20000, 0.4), // 距离缩放参数
        })
    },
    vueComps: {
        type: Object,
        default: () => ({
            marker: () => import('./components/PopupComponent.vue'),
        })
    },
    clickHandler: {
        type: Function,
        default: () => { console.log('Popup clicked'); }
    }
})

let _viewer_, _popup_;
const $bus = inject('$bus')
$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
    _popup_ = new PopupCreator(_viewer_, props.options, props.vueComps, props.clickHandler)
})

</script>
