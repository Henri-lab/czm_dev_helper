<template>
  <div class="openlayer"></div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore'
import { useFeatureStore } from '@/stores/featureStore'
import { ref, onMounted, watch, inject } from 'vue'
import sleep from '@/util/sleep'
import { getFeatureAtPixel, getPropsFromFeatureByAliyun } from '@/util/getOlObj/getFeature'

const mapStore = useMapStore()
const featureStore = useFeatureStore()
let $map = null
const app = inject('app')

onMounted(async () => {
  $map = app.config.globalProperties.$map
  if ($map) {
    // const layerWithBorderProvince = await mapStore.getLayerWithPolygonByAdcodeByAliyun(
    //   'defaultLayerWithFeature',
    //   420527, //改变这个adcode
    //   { wrapX: false }
    // )
    // layerWithBorderProvince.set('name', 'layerTest') //📌
    // $map.addLayer(layerWithBorderProvince)
    // $map.on('click', async (e) => {
    //   console.log()
    //   const layerName = 'layerTest'
    //   let featureArr = getFeatureAtPixel(e, $map, layerName)
    //   if (featureArr.length > 0) {
    //     const props = getPropsFromFeatureByAliyun(featureArr)
    //     props.forEach((prop) => console.log('test.vue-',prop.name,prop.adcode))
    //   }
    // })
    // $map.on('click', () => {
    //   console.log('click1')
    // })
    // $map.on('click', () => {
    //   console.log('click2')
    // })

    let flag = ref(false)
    $map.on('click', async () => {
      flag.value = !flag.value
      await sleep(1000)
      
    })
    watch(
      () => flag.value,
      () => console.log('watch flag')
    )
  }
})
</script>
