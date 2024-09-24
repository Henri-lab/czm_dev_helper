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
import { destination } from '@turf/turf';

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
function initMeshes(scene) {
    // 环形 extrude
    const closedSpline = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-60, 30, 60), // 左下
        new THREE.Vector3(-60, 100, 60), // 左中
        new THREE.Vector3(-60, 220, 60), // 左上
        new THREE.Vector3(60, 80, -60), // 右中
        new THREE.Vector3(60, 30, -60), // 右下
    ]);
    // 2、extrude settings
    closedSpline.curveType = "catmullrom";
    closedSpline.closed = true;
    const extrudeSettings = {
        steps: 100,
        bevelEnabled: false,
        extrudePath: closedSpline,
    };
    // 3、construct shape
    const r = 20; // 截面半径
    const pts1 = [];
    const count = 3; // 截面的棱边数量
    for (let index = 0; index < count; index++) {
        // index/count 几分之几，2π为周长
        const a = (index / count) * Math.PI * 2;
        pts1.push(new THREE.Vector2(r * Math.cos(a), r * Math.sin(a)));
    }
    const shape1 = new THREE.Shape(pts1);
    // create geometry
    const geometry1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings);
    // create material
    const material1 = new THREE.MeshLambertMaterial({
        color: 0xb00000,
    });
    // assembly meshes
    const mesh1 = new THREE.Mesh(geometry1, material1);
    // add mesh to scene
    scene.add(mesh1);

    // 第二个物体
    // path
    const randomPoints = [];
    for (let index = 0; index < 10; index++) {
        randomPoints.push(
            new THREE.Vector3((index - 4.5) * 80, THREE.MathUtils.randFloat(100, 150), THREE.MathUtils.randFloat(-50, 50))
        );
    }
    const randomSpline = new THREE.CatmullRomCurve3(randomPoints);
    const extrudeSettings2 = {
        steps: 200,
        bevelEnabled: false,
        extrudePath: randomSpline,
    };
    // shape
    const pts2 = [],
        numPts = 5;
    // 五角星是五个角十条边
    for (let i = 0; i < numPts * 2; i++) {
        // 计算radius 半径，基数为10反正20（就是内外圆计算）
        const r = i % 2 == 1 ? 10 : 20;
        // 角度
        const a = (i / numPts) * Math.PI;
        pts2.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
    }
    const shape2 = new THREE.Shape(pts2);
    const geometry2 = new THREE.ExtrudeGeometry(shape2, extrudeSettings2);
    const material2 = new THREE.MeshLambertMaterial({ color: 0xff8000 });
    const mesh2 = new THREE.Mesh(geometry2, material2);
    scene.add(mesh2);

    // 第三个物体
    const material3 = [material1, material2];
    const extrudeSettings3 = {
        depth: 20,
        steps: 1,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 4,
        bevelSegments: 1,
    };
    const geometry3 = new THREE.ExtrudeGeometry(shape2, extrudeSettings3);
    const mesh3 = new THREE.Mesh(geometry3, material3);
    mesh3.position.set(50, 220, 50);
    scene.add(mesh3);
}
function initLight(scene) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888);
    hemiLight.position.set(0, 1, 0);
    scene.add(hemiLight);
}
const main = () => {
    if (!__threeDiv__.value || !_viewer_) return
    const _3Config = {
        threeDom: __threeDiv__.value,
    }
    const _3Plugin = new threePlugin(_viewer_, _3Config)
    _3Plugin.install()
    let { renderer, scene } = _3Plugin._three
    renderer.setClearColor(0x00ff00, 0.3); // 设置背景颜色为不透明的绿色
    initMeshes(scene)
    initLight(scene)
    console.log(scene)

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