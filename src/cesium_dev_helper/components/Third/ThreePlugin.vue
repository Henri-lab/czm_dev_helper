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
    // 地球球体透明
    viewer.scene.globe.showGroundAtmosphere = false;
    viewer.scene.globe.baseColor = Cesium.Color.BLUE.withAlpha(0.1);
    viewer.scene.globe.translucency.enabled = true;
    viewer.scene.globe.undergroundColor = undefined;
    //禁用碰撞检测，允许`Cesium`相机穿透物体和进入地下
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false
    //开启地形深度测试
    viewer.scene.globe.depthTestAgainstTerrain = true
}
)

const main = () => {
    if (!__threeDiv__.value || !_viewer_) return
    const _3Config = {
        threeDom: __threeDiv__.value,
    }
    const _3Plugin = new threePlugin(_viewer_, _3Config)
    _3Plugin.install()
    let renderer3 = _3Plugin._three.renderer
    renderer3.setClearColor(0x00ff00, 0.3); // 设置背景颜色为不透明的绿色
    _viewer_.scene.postRender.addEventListener(() => {
        // 清除深度缓冲区
        renderer3.clearDepth()
    });
    _3Plugin.loop(() => {
        // console.log(_3Plugin._three.camera.matrixWorld.elements[12])
    })

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