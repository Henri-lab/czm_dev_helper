<template>
    <canvas id="three@henrifox" class="three@henrifox" ref="__three__"
        style="position: absolute;right: 0; top:0; width:100% ;height: 100%; z-index: 100;"></canvas>
</template>

<script setup>
// 同步摄像机
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
let minWGS84 = [115.23, 39.55];
let maxWGS84 = [116.23, 41.55];
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
    threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10 * 1000 * 1000);
    threeCamera.position.z = 5;
    threeCamera.position.x = 0;
    threeScene.add(new THREE.CameraHelper(threeCamera))
    threeScene.add(new THREE.AxesHelper())
}
const syncCamera = (czmCamera, threeCamera, threeCanvas) => {
    // console.log('syncCamera...')
    // Sync Field of View
    threeCamera.fov = Cesium.Math.toDegrees(czmCamera.frustum.fovy); // ThreeJS FOV is vertical
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
    // the matrixWorldInverse(=viewer matrix) allows you to understand how objects should appear relative to the camera’s position and orientation.
    threeCamera.matrixWorldInverse.set(
        cvm[0], cvm[4], cvm[8], cvm[12],
        cvm[1], cvm[5], cvm[9], cvm[13],
        cvm[2], cvm[6], cvm[10], cvm[14],
        cvm[3], cvm[7], cvm[11], cvm[15]
    );
    let cesiumPosition = czmCamera.positionWC; // Cesium camera world position (ECEF)
    let cameraPosition = new THREE.Vector3(cesiumPosition.x, cesiumPosition.y, cesiumPosition.z);
    threeCamera.position.copy(cameraPosition); // Sync position explicitly
    threeCamera.lookAt(new THREE.Vector3(0, 0, 0)); // Update this if necessary based on Cesium's camera direction
    if (!threeCanvas) {
        threeCamera.aspect = 2;
        threeRenderer.setSize(window.innerWidth, window.innerHeight); // Use window dimensions
    } else {
        let width = threeCanvas.clientWidth;
        let height = threeCanvas.clientHeight;
        let aspect = width / height;
        threeCamera.aspect = aspect;
        threeRenderer.setSize(width, height);
    }
    threeCamera.updateProjectionMatrix();
    // console.log(threeCamera.position)
};

const initEntity = (viewer) => {
    let entity = {
        name: 'Polygon',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                minWGS84[0], minWGS84[1],
                maxWGS84[0], minWGS84[1],
                maxWGS84[0], maxWGS84[1],
                minWGS84[0], maxWGS84[1],
            ]),
            height: 50,
            material: Cesium.Color.RED.withAlpha(0.2)
        }
    };
    let Polygon = viewer.entities.add(entity);
}
const initCube = () => {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = 'test-cube'
    cube.position.x = -2247266.554273245
    cube.position.y = 4586323.838773348
    cube.position.z = 4166935.748771129
    threeScene.add(cube);
    console.log(threeScene);
}

let timer
onMounted(() => {
    timer = setTimeout(
        () => {
            if (!__three__.value) return
            let center = Cesium.Cartesian3.fromDegrees(
                (minWGS84[0] + maxWGS84[0]) / 2,
                ((minWGS84[1] + maxWGS84[1]) / 2) - 1,
                200000
            );
            _viewer_.camera.flyTo({
                destination: center,
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-60),
                    roll: Cesium.Math.toRadians(0)
                },
                duration: 3
            });
            initThree(__three__.value)
            initEntity(_viewer_)
            initCube();
            // _viewer_.camera.changed.addEventListener(() => syncCamera(_viewer_.camera, threeCamera, __three__.value))
            function renderLoop() {
                requestAnimationFrame(renderLoop);
                _viewer_.render();
                threeRenderer.clearDepth();
                threeRenderer.render(threeScene, threeCamera);
                syncCamera(_viewer_.camera, threeCamera, __three__.value)
            } renderLoop();
        }
        , 0)
})
onBeforeUnmount(() => {
    clearTimeout(timer)
})
</script>
