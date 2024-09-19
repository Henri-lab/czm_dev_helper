<template>
    <canvas id="three@henrifox" class="three@henrifox" ref="__three__"
        style="position: absolute;right: 0; top:0; width:100% ;height: 100%; z-index: 1;"></canvas>
</template>

<script setup>
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
const initThree = (threeCanvas) => {
    if (!threeCanvas) {
        threeCanvas = document.getElementById('three@henrifox')
    }
    threeCanvas.style.pointerEvents = 'none';
    threeRenderer = new THREE.WebGLRenderer({
        canvas: threeCanvas,
        alpha: true,
        premultipliedAlpha: true
    });
    threeRenderer.setPixelRatio(window.devicePixelRatio);
    threeRenderer.autoClear = false;
    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10 * 1000 * 1000);
    threeCamera.position.z = 5;
    threeCamera.position.x = 0;
    const cameraHelper = new THREE.CameraHelper(threeCamera);
    threeScene.add(cameraHelper)
}

const syncCamera = (czmCamera, threeCamera, threeCanvas) => {
    console.log('syncing camera...')
    threeCamera.fov = Cesium.Math.toDegrees(czmCamera.frustum.fovy) // ThreeJS FOV is vertical
    threeCamera.updateProjectionMatrix();
    threeCamera.matrixAutoUpdate = false;
    let cvm = czmCamera.viewMatrix;
    let civm = czmCamera.inverseViewMatrix;
    threeCamera.matrixWorld.set(
        civm[0], civm[4], civm[8], civm[12],
        civm[1], civm[5], civm[9], civm[13],
        civm[2], civm[6], civm[10], civm[14],
        civm[3], civm[7], civm[11], civm[15]
    );
    threeCamera.matrixWorldInverse.set(
        cvm[0], cvm[4], cvm[8], cvm[12],
        cvm[1], cvm[5], cvm[9], cvm[13],
        cvm[2], cvm[6], cvm[10], cvm[14],
        cvm[3], cvm[7], cvm[11], cvm[15]
    );
    // threeCamera.matrixWorld.set(
    //     civm[0], civm[1], civm[2], civm[3],
    //     civm[4], civm[5], civm[6], civm[7],
    //     civm[8], civm[9], civm[10], civm[11],
    //     civm[12], civm[13], civm[14], civm[15]
    // );

    // threeCamera.matrixWorldInverse.set(
    //     cvm[0], cvm[1], cvm[2], cvm[3],
    //     cvm[4], cvm[5], cvm[6], cvm[7],
    //     cvm[8], cvm[9], cvm[10], cvm[11],
    //     cvm[12], cvm[13], cvm[14], cvm[15]
    // );
    threeCamera.lookAt(new THREE.Vector3(0, 0, 0));
    if (!threeCanvas) {
        threeCamera.aspect = 2;
    } else {
        let width = threeCanvas.clientWidth;
        let height = threeCanvas.clientHeight;
        let aspect = width / height;
        threeCamera.aspect = aspect;
    }
    threeCamera.updateProjectionMatrix();
}
const initCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    threeScene.add(cube);
    // function animate() {
    //     requestAnimationFrame(animate);
    //     cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;
    //     threeRenderer.render(threeScene, threeCamera);
    // } animate();
}

let timer
onMounted(() => {
    timer = setTimeout(
        () => {
            if (!__three__.value) return
            _viewer_.useDefaultRenderLoop = false;
            initThree(__three__.value)
            _viewer_.camera.changed.addEventListener(() => {
                syncCamera(_viewer_.camera, threeCamera, __three__.value);
            });
            initCube();
            function render() {
                requestAnimationFrame(render);
                _viewer_.render();
                threeRenderer.clearDepth();
                threeRenderer.render(threeScene, threeCamera);
            }
            render();

        }
        , 0)
})
onBeforeUnmount(() => {
    clearTimeout(timer)
})
</script>
