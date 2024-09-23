<template>
    <div id="three@henrifox" class="three@henrifox" ref="__threeDiv__"
        style="position: absolute;right: 0; top:0; width:100% ;height: 100%; z-index: 100;pointer-events: none;"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import * as Cesium from 'cesium';
import { onBeforeUnmount } from 'vue';
import threePlugin from '../../lib/Plugin/threePlugin'
import { render } from 'vue';

const __threeDiv__ = ref();
let _cM_, _viewer_
let threeCamera, threeScene, threeRenderer
let cube
const $bus = inject('$bus')
$bus.on('czmCameraEvent@henrifox', (cM) => {
    _cM_ = cM
})
$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
}
)

const main = () => {
    if (!__threeDiv__.value || !_viewer_) return
    const _3Config = {
        threeDom: __threeDiv__.value,
    }
    const _3Plugin = new threePlugin(_viewer_, _3Config)
    _3Plugin.install()
    _3Plugin.loop(() => _viewer_.render())
    console.log(_3Plugin)
}


let timer
onMounted(() => {
    timer = setTimeout(
        () => {
            main()
        }
        , 0)
})
onBeforeUnmount(() => {
    clearTimeout(timer)
})
</script>