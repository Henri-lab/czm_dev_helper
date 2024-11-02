<template></template>

<script setup>
let terrain;
const $bus = inject('$bus');
let _viewer_;
import { onBeforeMount, onMounted } from 'vue';
import { Imagery } from '../../lib/Custom';
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
            terrain = Imagery.getImagery('default');
        } else {
            terrain = Imagery.getImagery(props.name);
        }
        _viewer_.terrainProvider = terrain;

    });

});
onBeforeMount(() => {
    clearTimeout(time);
});
</script>