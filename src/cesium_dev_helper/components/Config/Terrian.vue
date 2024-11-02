<template></template>

<script setup>
let terrain;
const $bus = inject('$bus');
let _viewer_;
import { onBeforeMount, onMounted } from 'vue';
import { Terrain } from '../../lib/Custom';
$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
});
const props = defineProps({
    name: {
        type: String,
        default: 'default'
    }
})

let time
onMounted(() => {
    time = setTimeout(() => {
        if (props.name == 'default' && navigator.onLine) {
            //guatantee internet connection
            terrain = Terrain.getTerrian('default');
        } else {
            terrain = Terrain.getTerrian(props.name);
        }
        _viewer_.terrainProvider = terrain;

        _viewer_.scene.postProcessStages.fxaa.enabled = true; // 开启抗锯齿

        // 使用CSS滤镜增加自定义效果
        _viewer_.container.style.filter = "grayscale(0.8) contrast(1.2) brightness(1.1)";

    });

});
onBeforeMount(() => {
    clearTimeout(time);
});
</script>