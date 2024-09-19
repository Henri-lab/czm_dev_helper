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
        threeRenderer.setSize(window.clientWidth, window.clientHeight);
    } else {
        let width = threeCanvas.clientWidth;
        let height = threeCanvas.clientHeight;
        let aspect = width / height;
        threeCamera.aspect = aspect;
        threeRenderer.setSize(width, height);
    }
    threeCamera.updateProjectionMatrix();
    threeRenderer.render(threeScene, threeCamera);
}

class _3DObject {
    constructor() {
        this.threeMesh = null; //Three.js 3DObject.mesh
        this.minWGS84 = null; //location bounding box
        this.maxWGS84 = null;
    }
}
let _3Dobjects = [];
const init3DObject = (viewer) => {
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

    // Lathe geometry
    let doubleSideMaterial = new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide
    });
    let segments = 10;
    let points = [];
    for (let i = 0; i < segments; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * segments + 5, (i - 5) * 2));
    }
    let geometry = new THREE.LatheGeometry(points);
    let latheMesh = new THREE.Mesh(geometry, doubleSideMaterial);
    latheMesh.scale.set(1500, 1500, 1500); //scale object to be visible at planet scale
    latheMesh.position.z += 15000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
    latheMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
    let latheMeshYup = new THREE.Group();
    latheMeshYup.add(latheMesh)
    threeScene.add(latheMeshYup); // don’t forget to add it to the Three.js scene manually

    //Assign Three.js object mesh to our object array
    let _3DOB = new _3DObject();
    _3DOB.threeMesh = latheMeshYup;
    _3DOB.minWGS84 = minWGS84;
    _3DOB.maxWGS84 = maxWGS84;
    _3Dobjects.push(_3DOB);

    // dodecahedron
    geometry = new THREE.DodecahedronGeometry();
    let dodecahedronMesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
    dodecahedronMesh.scale.set(5000, 5000, 5000); //scale object to be visible at planet scale
    dodecahedronMesh.position.z += 15000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
    dodecahedronMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
    let dodecahedronMeshYup = new THREE.Group();
    dodecahedronMeshYup.add(dodecahedronMesh)
    threeScene.add(dodecahedronMeshYup); // don’t forget to add it to the Three.js scene manually

    //Assign Three.js object mesh to our object array
    _3DOB = new _3DObject();
    _3DOB.threeMesh = dodecahedronMeshYup;
    _3DOB.minWGS84 = minWGS84;
    _3DOB.maxWGS84 = maxWGS84;
    _3Dobjects.push(_3DOB);
}
const renderThreeObj = () => {
    let cartToVec = function (cart) {
        return new THREE.Vector3(cart.x, cart.y, cart.z);
    };
    // Configure Three.js meshes to stand against globe center position up direction
    _3Dobjects.forEach((item) => {
        let minWGS84 = item.minWGS84;
        let maxWGS84 = item.maxWGS84;
        // convert lat/long center position to Cartesian3
        let center = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2);
        // get forward direction for orienting model
        let centerHigh = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2, 1);
        // use direction from bottom left to top left as up-vector
        let bottomLeft = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1]));
        let topLeft = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1]));
        let latDir = new THREE.Vector3().subVectors(bottomLeft, topLeft).normalize();
        // configure entity position and orientation
        item.threeMesh.position.copy(center);
        item.threeMesh.lookAt(centerHigh);
        item.threeMesh.up.copy(latDir);
    })
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
            init3DObject(_viewer_)
            function renderLoop() {
                requestAnimationFrame(renderLoop);
                _viewer_.render();
                threeRenderer.clearDepth();
                renderThreeObj();
                syncCamera(_viewer_.camera, threeCamera, __three__.value);
            } renderLoop();

        }
        , 0)
})
onBeforeUnmount(() => {
    clearTimeout(timer)
})
</script>
