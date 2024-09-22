<template>
    <canvas id="three@henrifox" class="three@henrifox" ref="__three__"
        style="position: absolute;right: 0; top:0; width:100% ;height: 100%; z-index: 100;"></canvas>
</template>

<script setup>
// 共享上下文
import { onMounted } from 'vue';
import * as THREE from 'three';
import * as Cesium from 'cesium';
import { onBeforeUnmount } from 'vue';
import { getGlOfViewer } from '../../lib/util/versionOf';
const __three__ = ref();
let _cM_, _viewer_
let threeCamera, threeScene, threeRenderer
const $bus = inject('$bus')
$bus.on('czmCameraEvent@henrifox', (cM) => {
    _cM_ = cM
})
$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
}
)
const initThree = (threeCanvas, czm_gl) => {
    if (!threeCanvas) {
        threeCanvas = document.getElementById('three@henrifox')
    }
    threeCanvas.style.pointerEvents = 'none';
    threeRenderer = new THREE.WebGLRenderer({
        canvas: threeCanvas,
        context: czm_gl,
        alpha: true,
        premultipliedAlpha: true
    });
    threeRenderer.setPixelRatio(window.devicePixelRatio);
    threeRenderer.autoClear = false;
    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    threeCamera.position.z = 5;
    threeCamera.position.x = 0;
    const cameraHelper = new THREE.CameraHelper(threeCamera);
    threeScene.add(cameraHelper)
}
const initCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = 'test-cube'
    threeScene.add(cube);
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        // threeRenderer.render(threeScene, threeCamera);
    } animate();
}

let timer
onMounted(() => {
    timer = setTimeout(
        () => {
            if (!__three__.value) return
            _viewer_.useDefaultRenderLoop = false;
            initThree(_viewer_.canvas, getGlOfViewer(_viewer_))
            initCube();
            // console.log(threeScene)

            let frameId;
            let currentFrame = 0;
            function render() {
                // if (frameId) {
                //     cancelAnimationFrame(frameId);
                // }
                // if (currentFrame % 2 === 0) {
                //     threeRenderer.render(threeScene, threeCamera);
                // } else {
                //     _viewer_.render();
                // }
                // frameId = requestAnimationFrame(render);
                // currentFrame++;
                Math.random() > 0.0 ? threeRenderer.render(threeScene, threeCamera) : _viewer_.render();
                requestAnimationFrame(render);
            }
            render();
        }
        , 0)
})
onBeforeUnmount(() => {
    clearTimeout(timer)
})
</script>
