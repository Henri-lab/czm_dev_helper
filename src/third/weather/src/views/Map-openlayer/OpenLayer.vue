<template>
  <div class="openlayer"></div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore'
import { useEventStore } from '@/stores/eventStore'
import { useFeatureStore } from '@/stores/featureStore'
import { ref, onMounted, watch, inject } from 'vue'
import sleep from '@/util/sleep'

const mapStore = useMapStore()
const featureStore = useFeatureStore()
const eventStore = useEventStore()
let $map = null
const app = inject('weather-app')//@provide
const isOnMounted = ref(false)
const isMapCilcked = ref(false)

// 挂载立即请求省级边界
// 添加省级边界的图层并设置名称
// 鼠标探测是否有矢量元素，如果有就改变cursor样式
// 监测地图点击事件的发生
// 监听地图的缩放事件
onMounted(() => {
  $map = app.config.globalProperties.$map
  if ($map) {
    $map.on('pointermove', function (e) {
      let pixel = $map.getEventPixel(e.originalEvent)
      let hit = $map.hasFeatureAtPixel(pixel)
      $map.getTargetElement().style.cursor = hit ? 'pointer' : ''
    })
    const click_isMapClicked = $map.on('click', function (e) {
      isMapCilcked.value = !isMapCilcked.value
    })
    $map.getView().on('change:resolution', function (e) {
      let currentZoom = $map.getView().getZoom()
      mapStore.currentZoom = parseInt(currentZoom)

      if (currentZoom < 5)
        mapStore.loadUniqueLayerWithPolygonByAdcodeByAliyun(
          $map,
          100000,
          'initialPolygon_aliyun',
          'layerLevel'
        )
    })
    isOnMounted.value = true
  }
})

// 组件挂载后添加高level图层和全国多边形矢量图层
watch(
  () => isOnMounted.value,
  async () => {
    await mapStore.loadLayerWithPolygonByAdcodeByAliyun(
      $map,
      100000,
      'cityPolygon_aliyun',
      'layerLevel'
    )
    await mapStore.loadLayerWithPolygonByAdcodeByAliyun($map, 100000, 'basic', 'entranceLayer')
  }
)

// \\🐱‍👤//
// 当move到不同的区划，更新adcodeLevel
// 并click某个不同的高level矢量元素时
// 移除先前添加的低level图层
// 请求点击地区的图层(带矢量)
// 添加此图层并设置名称
let adcodeLevel = null
watch(
  () => featureStore.currentAdcodeLevel,
  () => {
    adcodeLevel = featureStore.currentAdcodeLevel
  }
)
watch(
  () => isMapCilcked.value,
  async () => {
    mapStore.islayerNextLevelLoaded = false
    let title = 'cityPolygon_aliyun'
    let layerName = 'layerNextLevel'
    await mapStore.loadUniqueLayerWithPolygonByAdcodeByAliyun($map, adcodeLevel, title, layerName)

    mapStore.islayerNextLevelLoaded = true
  }
)

// method
</script>
