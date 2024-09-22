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
import PrimitiveThreeJS from '@/cesium_dev_helper/lib/Plugin/PrimitiveThreeJS';
const __three__ = ref();
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

const initThreeByCzmCtx = (viewer, dom) => {
    // 获取 Cesium 的 WebGL 上下文
    const cesiumGlContext = getGlOfViewer(viewer);
    // 创建 Three.js 渲染器，使用 Cesium 的 WebGL 上下文
    threeRenderer = new THREE.WebGLRenderer({
        context: cesiumGlContext,
        // Cesium 管理清除颜色，所以禁用自动清除
        autoClear: false,
    });
    threeRenderer.setSize(dom.innerWidth, dom.innerHeight);
    // 创建 Three.js 场景
    threeScene = new THREE.Scene();
    // 创建 Three.js 相机
    threeCamera = new THREE.PerspectiveCamera(
        45, // 视角
        dom.innerWidth / dom.innerHeight, // 纵横比
        1, // 近剪切面
        10000 // 远剪切面
    );
    // 添加一个示例对象（旋转的立方体）
    const geometry = new THREE.BoxGeometry(200.0, 200.0, 200.0);
    const material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, material);
    threeScene.add(cube);
}



let timer
onMounted(() => {
    timer = setTimeout(
        () => {
            if (!__three__.value) return
            initThreeByCzmCtx(_viewer_, __three__.value)
            // 创建 ThreeJSPrimitive 实例
            const threeJSPrimitive = new PrimitiveThreeJS(threeScene, threeCamera, threeRenderer, _viewer_);

            // 将 ThreeJSPrimitive 添加到 Cesium 场景
            _viewer_.scene.primitives.add(threeJSPrimitive);
           
            // 自定义渲染循环
            function render() {
                // 更新 Cesium
                _viewer_.resize();
                _viewer_.render();

                // 更新 Three.js 场景中的动画
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;

                // 请求下一帧渲染
                requestAnimationFrame(render);
            }
            render()
        }
        , 0)
})
onBeforeUnmount(() => {
    clearTimeout(timer)
})
</script>