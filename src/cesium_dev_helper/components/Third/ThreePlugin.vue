<template>
    <div id="three@henrifox" class="three@henrifox" ref="__threeDiv__"
        style="position: absolute;right: 0; top:0; width:100% ;height: 100%; z-index: 2;pointer-events: none;"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import * as Cesium from 'cesium';
import { onBeforeUnmount } from 'vue';
import threePlugin from '../../lib/Plugin/threePlugin'


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
    // viewer.scene.globe.showGroundAtmosphere = false;
    // viewer.scene.globe.baseColor = Cesium.Color.BLUE.withAlpha(1);
    // viewer.scene.globe.translucency.enabled = true;
    // viewer.scene.globe.undergroundColor = undefined;
    //禁用碰撞检测，允许`Cesium`相机穿透物体和进入地下
    // viewer.scene.screenSpaceCameraController.enableCollisionDetection = false
    //开启地形深度测试
    viewer.scene.globe.depthTestAgainstTerrain = true
}
)
const props = defineProps({
    children: {
        type: Array,
        default: []
    }
})

const main = () => {
    if (!__threeDiv__.value || !_viewer_) return
    const _3Config = {
        threeDom: __threeDiv__.value,
    }
    const _3Plugin = new threePlugin(_viewer_, _3Config)
    _3Plugin.install()
    $bus.emit('czmThreeEvent@henrifox', _3Plugin._three)
    let { renderer, scene } = _3Plugin._three
    props.children.forEach(obj3 => {
        scene.add(obj3)
    })

    _viewer_.scene.postRender.addEventListener(() => {
        // 清除深度缓冲区
        renderer.clearDepth()

    });
    _3Plugin.loop(() => {

    })

}


let timer
onMounted(() => {
    timer = setTimeout(
        () => {
            main()
            _viewer_.camera.flyTo({
                destination: {
                    x: -1337040.1191728008,
                    y: 5329573.2418631995,
                    z: 3229397.360308857
                },
                orientation: {
                    roll: Cesium.Math.toRadians(0.0018649408425688095),
                    heading: Cesium.Math.toRadians(345.96071189778115),
                    pitch: Cesium.Math.toRadians(-23.882613138384933)
                },
                duration: 1.5
            })
        }
        , 0)
})
onBeforeUnmount(() => {
    clearTimeout(timer)
})
</script>