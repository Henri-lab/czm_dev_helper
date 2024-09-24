<!-- 创建ceisum地图视图 并且加载对应视图的管理者 -->
<template>
  <div class="czm-context@henrifox" ref="__CzmCtx__" style="position: relative;">
    <div class="debug" v-show="props.debug" style="background-color: blanchedalmond; color: red;">
      pickPosition: {{ pickPosition }}<br>
      screenCoord:{{ screenCoord }}<br>
      threeObjCoord:{{ threeObjCoord }}
    </div>
    <div class="three-debug-viewer" ref="__threeDebugViewer__" v-draggable
      style="position: absolute;width: 500px;height: 500px; z-index: 100;background-color: rgba(128, 255, 0, 0.402);">
    </div>
  </div>
</template>

<script setup>
import { markRaw, onMounted, watch, inject, computed } from 'vue';
import * as Cesium from 'cesium';
import * as THREE from 'three';
import _ from 'lodash';
import { onBeforeUnmount } from 'vue';

const __CzmCtx__ = ref()
const __threeDebugViewer__ = ref()
const $bus = inject('$bus');
const $store = inject('$store');
const props = defineProps({
  debug: {
    type: String,
    default: ''
  },
})

let debugs = props.debug.split('&')
let $viewer
let $scene
let $camera
const pickPosition = ref()
const screenCoord = ref()
$bus.on('czmViewerEvent@henrifox', (viewer) => {
  // console.log(viewer, 'ctx:$viewer')
  $viewer = viewer
  $scene = $viewer.scene
  $camera = $viewer.camera
  if (debugs.indexOf('cesium') > -1) {
    const handler = new Cesium.ScreenSpaceEventHandler($scene.canvas);
    handler.setInputAction(function (event) {
      screenCoord.value = event.startPosition
      let pickedPos
      if ($viewer.scene.pickPositionSupported) {
        pickedPos = $viewer.scene.pickPosition(screenCoord.value);
      } else {
        pickedPos = $viewer.scene.camera.pickEllipsoid(
          screenCoord.value, $viewer.scene.globe.ellipsoid);
      }
      pickPosition.value = pickedPos
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  }
})
let _three_, _camera_, _renderer_, _scene_;
$bus.on('czmThreeEvent@henrifox', (three) => {
  _three_ = three
  _camera_ = _three_.camera
  _renderer_ = _three_.renderer
  _scene_ = _three_.scene
  if (debugs.indexOf('three') > -1) {
    // createThreeCoord()
    // addCamera(_scene_)
    copyThreeScene(_scene_)
  }
  // console.log(_scene_)
})

const threeObjCoord = ref()
const createThreeCoord = () => {
  // 鼠标位置变量
  const mouse = new THREE.Vector2();
  // 添加鼠标移动事件监听器
  window.addEventListener('mousemove', onMouseMove, false);
  function onMouseMove(event) {
    // 计算鼠标在屏幕上的位置，范围在 -1 到 1 之间
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }
  const raycaster = new THREE.Raycaster();
  // 创建一个小球来表示交点位置
  const sphereGeometry = new THREE.SphereGeometry(5, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
  const intersectionSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  intersectionSphere.name = '_intersectionSphere_'
  _scene_.add(intersectionSphere);

  function animate() {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, _camera_);
    const intersects = raycaster.intersectObjects(_scene_.children, true);
    console.log(intersects.length)

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const point = intersect.point;
      threeObjCoord.value = point

      // 更新小球的位置
      intersectionSphere.position.copy(point);

      // 显示小球
      intersectionSphere.visible = true;
    } else {
      // 如果没有交点，隐藏小球
      intersectionSphere.visible = false;
    }

    _renderer_.render(_scene_, _camera_);
  }

  animate();
}
const addCamera = (_scene_) => {
  let width = _scene_.canvasWidth
  let height = _scene_.canvasHeight
  let camera = new THREE.PerspectiveCamera(45, width / height, 1, 10 * 1000 * 100);
  camera.position.set(0, 0, 0);
  let helper = new THREE.CameraHelper(camera)
  _scene_.superAdd(camera)
  _scene_.superAdd(helper)
  return camera
}
const copyThreeScene = (_scene_) => {//three debug canvas
  if (!__threeDebugViewer__.value) return
  const renderer = new THREE.WebGLRenderer()
  const scene = (_scene_)
  const camera = addCamera(scene)
  const canvas = renderer.domElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  __threeDebugViewer__.value.appendChild(canvas)
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}



const main = () => {
}
let timer = setTimeout(main, 0)
onMounted(
  () => timer
)
onBeforeUnmount(() => clearTimeout(timer))

defineExpose({ $viewer, $scene, $camera })

</script>