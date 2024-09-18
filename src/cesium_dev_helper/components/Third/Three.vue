<template>
    <canvas id="three@henrifox" class="three@henrifox" ref="__three__"
        style="position: absolute;right: 0; top:0; width:100% ;height: 100%; z-index: 999;"></canvas>

    <div id="test"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import * as Cesium from 'cesium';
import { onBeforeUnmount } from 'vue';
import { getGlOfViewer } from '../../lib/util/versionOf';
let _cM_, _viewer_
let threeCamera, threeScene, threeRenderer
let lastTime = performance.now();
const $bus = inject('$bus')
$bus.on('czmCameraEvent@henrifox', (cM) => {
    _cM_ = cM
})
$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
}
)
function testNaN(positionArray) {
    let hasNaN = false;
    for (let i = 0; i < positionArray.length; i++) {
        if (isNaN(positionArray[i])) {
            console.error(`NaN found at index ${i}`);
            hasNaN = true;
            break;
        }
    }
    if (!hasNaN) {
        console.log('No NaN values in position attribute.');
    }

}
function setPositions(data, geometry) {
    const positions = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) {
        const value = parseFloat(data[i]);
        if (isNaN(value)) {
            console.warn(`Invalid data at index ${i}: ${data[i]}`);
            positions[i] = 0;
        } else {
            positions[i] = value;
        }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
}
const initThree = (threeCanvas, czm_gl) => {
    if (!threeCanvas) {
        threeCanvas = document.getElementById('three@henrifox')
    }
    // console.log(threeCanvas)
    threeRenderer = new THREE.WebGLRenderer({
        canvas: threeCanvas,
        // context: czm_gl,
        alpha: true,
        premultipliedAlpha: false
    });
    threeRenderer.setPixelRatio(window.devicePixelRatio);
    threeRenderer.setSize(200, 200);
    threeRenderer.autoClear = false;
    threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color(0, 0, 0);
    threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    threeCamera.position.z = 5;
    threeCamera.position.x = 0;
}

// 粒子系统设置
const particleCount = 20;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);
let particleSystem;
const initParticles = () => {
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        velocities[i * 3] = (Math.random() - 0.5) * 1.5;
        velocities[i * 3 + 1] = Math.random() * 1.5;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    setPositions(positions, particles);
    const positionArray = particles.attributes.position.array;
    testNaN(positionArray)
    particles.userData = { velocities };
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x888888,
        size: 10,
        transparent: true,
        opacity: 0.7,
        map: new THREE.TextureLoader().load('images/texture1.jpg'), // 替换为烟雾纹理路径
        blending: THREE.AdditiveBlending,
        depthTest: false
    });

    particleSystem = new THREE.Points(particles, particleMaterial);
    threeScene.add(particleSystem);
    function render() {
        const currentTime = performance.now();
        const delta = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        //  _cM_.syncWithThree(threeCamera);//bug
        // 更新粒子
        updateParticles(delta);
        // 清除Three.js渲染器
        threeRenderer.clearDepth();
        // 渲染Three.js内容
        threeRenderer.render(threeScene, threeCamera);
        // 请求下一帧
        requestAnimationFrame(render);
    } render();

}
const updateParticles = (delta) => {
    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.geometry.userData.velocities;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
        // 检查是否超过阈值，避免溢出
        if (positions[i * 3 + 1] > 1000) { // 根据需求调整阈值
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
        }
        // 额外检查
        if (
            !isFinite(positions[i * 3]) ||
            !isFinite(positions[i * 3 + 1]) ||
            !isFinite(positions[i * 3 + 2])
        ) {
            // console.warn(`Invalid position detected for particle ${i}`);
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
        }
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
}
const initCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    threeScene.add(cube);
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        threeRenderer.render(threeScene, threeCamera);
    } animate();
}



const syncCamera = () => {
    const viewMatrix = _cM_.camera.viewMatrix;
    const projectionMatrix = _cM_.camera.frustum.projectionMatrix;

    if (viewMatrix && projectionMatrix) {
        // Convert Cesium's matrix (which is column-major) to Three.js matrix (also column-major)
        threeCamera.projectionMatrix.fromArray(projectionMatrix);
        threeCamera.projectionMatrixInverse.copy(threeCamera.projectionMatrix).invert();

        threeCamera.matrixWorldInverse.fromArray(viewMatrix);
        threeCamera.matrixWorld.copy(threeCamera.matrixWorldInverse).invert();

        // Mark the matrices as updated
        threeCamera.projectionMatrix.needsUpdate = true;
        threeCamera.matrixWorld.needsUpdate = true;
    } else {
        console.warn('Cesium camera matrices are not ready.');
    }
};

let timer
const __three__ = ref();
onMounted(() => {
    timer = setTimeout(
        () => {
            if (!__three__.value) return
            _viewer_.camera.changed.addEventListener(() => {
                syncCamera(); // sync the Cesium camera with Three.js
                _viewer_.camera.update(_viewer_.scene.frameState);

            });

            initThree(__three__.value)
            // initThree(_viewer_.canvas, getGlOfViewer(_viewer_))
            // initParticles()
            initCube();

            // console.log('three ready', threeCamera, threeScene, threeRenderer)
        }
        , 0)


    // test 开启webgl2失败
    // Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_KEY;
    // const viewer2 = new Cesium.Viewer('test', {
    //     contextOptions: {
    //         webgl2: true
    //     }
    // })
    // console.log(viewer2)
})

onBeforeUnmount(() => {
    clearTimeout(timer)
})

</script>
