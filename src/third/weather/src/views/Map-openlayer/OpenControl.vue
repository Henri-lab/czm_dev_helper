<template>
  <div class="opencontrol">
    <span class="tech">openLayer|高德地图API|</span>
    <div id="coordinates" ref="mouse"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject, getCurrentInstance } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useMouseStore } from '@/stores/mouseStore'
import coordinateFormat from '@/util/format/coordinateFormat'
import { addControls } from '@/util/addOlObj'
import sleep from '@/util/sleep'

const mouseStore = useMouseStore()
const mouse = ref()
let $map = null
const app = inject('weather-app')//@provide

onMounted(() => {
  $map = app.config.globalProperties.$map
  if ($map) {
    const gdTile = $map.getLayers()

    // 添加控件
    const controls = ['ZoomSlider', 'FullScreen', 'OverviewMap', 'ZoomToExtent']
    const optionsArr = [
      {
        type: 'ZoomToExtent',
        extent: [116.2, 39.75, 116.5, 40.05]
      },
      {
        type: 'ZoomSlider'
      },
      {
        type: 'FullScreen'
      },
      {
        type: 'OverviewMap',
        className: 'ol-overviewmap ol-custom-overviewmap',
        layers: [gdTile],
        collapseLabel: '\u00BB',
        label: '\u00AB',
        collapsed: false,
        view: new ol.View({
          minZoom: 0,
          maxZoom: 22
        })
      }
    ]
    addControls(controls, optionsArr, $map)

    // 鼠标事件-获取鼠标平面坐标
    // 转换平面投影到经纬度
    // 调整格式并视图展示
    // 更新mouseStore中的鼠标经纬度
    $map.on('pointermove', (e) => {
      if (mouse.value) {
        let domEle = mouse.value
        let XYarr = e.coordinate.map((item) => item)
        if (XYarr.length) {
          domEle.innerHTML = coordinateFormat(XYarr[0], XYarr[1])

          const jingwei = ol.proj.toLonLat(XYarr, 'EPSG:3857')

          mouseStore.mouseJing = parseFloat(jingwei[0].toFixed(6))
          mouseStore.mouseWei = parseFloat(jingwei[1].toFixed(6))
        }
      }
    })

    //默认鼠标经纬度文本
    if (mouse.value) {
      let domEle = mouse.value
      domEle.innerHTML = '👽点击地图'
      window.addEventListener('mouseover', (e) => {
        if (!e.target.classList.contains('openmap')) domEle.innerHTML = '👽点击地图'
      })
    }

  } else {
    console.error('$map is not initialized.')
    return
  }
})
</script>

<style lang="scss" scoped>
.opencontrol {
  position: relative;
  width: 960px;
  height: 25px;
  margin: 0 auto;
  background-color: var(--bcolor2);
  .tech {
    color: white;
  }
  #coordinates {
    position: absolute;
    z-index: 100;
    left: 50%;
    top: -240%;
    transform: translate(-50%, -50%);
    transform: translateX(-50%);
    width: 25%;
    height: 100%;
    background-color: #652e8080;
    text-align: center;
    line-height: 25px;
    color: #fff;
    border-radius: 5px;
    .ol-zoomslider {
      top: 7.5em !important;
      background-color: #652e8099;
    }
    .ol-zoomslider:hover {
      background-color: #652e8080;
      cursor: pointer;
    }

    .ol-custom-overviewmap {
      left: 0;
      bottom: 0;
      top: auto;
      left: auto;
    }

    .ol-overviewmap-box {
      border: 1px solid #ff2d51;
    }
  }
}
</style>
