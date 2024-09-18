<template>
    <div class="three@henrifox" ref="__three__"></div>
</template>

<script setup>
import { onMounted } from 'vue';


const __three__ =ref();
onMounted(()=>{
    // 获取Three.js的Canvas
const threeCanvas = __three__.value;

// 创建Three.js渲染器
const threeRenderer = new THREE.WebGLRenderer({
    canvas: threeCanvas,
    alpha: true,
    premultipliedAlpha: false
});
threeRenderer.setPixelRatio(window.devicePixelRatio);
threeRenderer.setSize(window.innerWidth, window.innerHeight);
threeRenderer.autoClear = false; // 让Cesium先渲染，然后再渲染Three.js内容

// 创建Three.js场景
const threeScene = new THREE.Scene();

// 创建Three.js相机（将同步Cesium的相机）
const threeCamera = new THREE.PerspectiveCamera();

// 调整Three.js Canvas的样式以覆盖Cesium
threeCanvas.style.position = 'absolute';
threeCanvas.style.top = '0';
threeCanvas.style.left = '0';
threeCanvas.style.width = '100%';
threeCanvas.style.height = '100%';
})

</script>

<style lang="scss" scoped>

</style>