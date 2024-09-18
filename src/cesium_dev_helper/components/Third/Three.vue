<template>
    <canvas class="three@henrifox" ref="__three__"
        style="position: absolute;right: -50%; top:0; width:20% ;height: 20%; z-index: 999;"></canvas>
</template>

<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import { onBeforeUnmount } from 'vue';
let _cM_
let threeCamera, threeScene, threeRenderer
let lastTime = performance.now();
const $bus = inject('$bus')
$bus.on('czmCameraEvent@henrifox', (cM) => {
    _cM_ = cM
})

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
const initThree = (threeCanvas) => {
    if (!threeCanvas) {
        threeCanvas = document.createElement('canvas')
        threeCanvas.classList.add('three@henrifox')
    }
    threeRenderer = new THREE.WebGLRenderer({
        canvas: threeCanvas,
        alpha: true,
        premultipliedAlpha: false
    });
    threeRenderer.setPixelRatio(window.devicePixelRatio);
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
    threeRenderer.autoClear = true;
    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    threeCamera.position.z = 50;
    threeCamera.position.x = -5;
}
const render = () => {
    const currentTime = performance.now();
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    // 同步相机
    syncCamera()
    //  _cM_.syncWithThree(threeCamera);//bug
    // 更新粒子
    updateParticles(delta);
    // 清除Three.js渲染器
    threeRenderer.clearDepth();
    // 渲染Three.js内容
    threeRenderer.render(threeScene, threeCamera);
    // 请求下一帧
    requestAnimationFrame(render);
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
    console.log(positionArray)

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

const syncCamera = () => {
    // 获取Cesium相机的视图矩阵和投影矩阵
    const viewMatrix = _cM_.camera.viewMatrix;
    const projectionMatrix = _cM_.camera.frustum.projectionMatrix;
    // Cesium,Three.js使用的都是列主序，可以直接使用Cesium的矩阵数据
    // 更新投影矩阵
    threeCamera.projectionMatrix.fromArray(projectionMatrix);
    threeCamera.projectionMatrixInverse.copy(threeCamera.projectionMatrix).invert();
    // 更新世界矩阵
    threeCamera.matrixWorldInverse.fromArray(viewMatrix);
    threeCamera.matrixWorld.copy(threeCamera.matrixWorldInverse).invert();
    // 标记更新
    threeCamera.projectionMatrix.needsUpdate = true;
    threeCamera.matrixWorld.needsUpdate = true;
}

let timer
const __three__ = ref();
onMounted(() => {
    timer = setTimeout(
        () => {
            if (!__three__.value) return
            initThree(__three__.value)
            window.addEventListener('resize', () => {// 处理窗口调整大小
                threeRenderer.setSize(window.innerWidth, window.innerHeight);
            });
            initParticles()
            updateParticles()
            render();// 开始渲染循环
            console.log('three ready', threeCamera, threeScene, threeRenderer)
        }
        // () => {
        //     // 创建场景
        //     initThree(__three__.value)
        //     threeRenderer.setSize(window.innerWidth, window.innerHeight);
        //     const geometry = new THREE.BoxGeometry();
        //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        //     const cube = new THREE.Mesh(geometry, material);
        //     threeScene.add(cube);
        //     function animate() {
        //         requestAnimationFrame(animate);
        //         cube.rotation.x += 0.01;
        //         cube.rotation.y += 0.01;
        //         threeRenderer.render(threeScene, threeCamera);
        //     }
        //     window.addEventListener('resize', () => {
        //         threeRenderer.setSize(window.innerWidth, window.innerHeight);
        //         threeCamera.aspect = window.innerWidth / window.innerHeight;
        //         threeCamera.updateProjectionMatrix();
        //     })
        //     animate();
        // }
        , 0)
})

onBeforeUnmount(() => {
    clearTimeout(timer)
})

</script>
