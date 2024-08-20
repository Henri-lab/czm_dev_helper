<script setup>
import NaviHead from './components/NaviHead.vue'
import WeatherPrediction from './components/WeatherPrediction.vue'
import DialogMark from './components/common//DialogMark.vue'
import OpenMap from './views/Map-openlayer/OpenMap.vue'
import OpenControl from './views/Map-openlayer/OpenControl.vue'
import SideComponent from './components/SideComponent.vue'
import OpenLayer from './views/Map-openlayer/OpenLayer.vue'
import ParseFeature from './views/Map-openlayer/ParseFeature.vue'
import CityHot from './views/CityHot.vue'
import Test from '@/test/test.vue'
import { onMounted } from 'vue'

const author = '@henriFox:https://github.com/Henri-lab/weather'
onMounted(() => {
  console.log(author)
})
</script>

<template>
  <div id="weather-app">
    <div class="box">
      <NaviHead />
      <router-view name="citySearchAndWeather" />
      <WeatherPrediction />
      <OpenMap />
      <OpenControl />
      <OpenLayer />
      <ParseFeature />
      <!-- <Test></Test>  -->
      <!-- <router-view name="hotCity"/> -->
      <!-- <CityHot></CityHot> -->
      <!-- <DialogMark /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
#app {
  height: 2000px;
  .box {
    height: 100%;
    background-color: var(--bcolor);
    position: relative;
    .animation {
      position: absolute;
      top: 3%;
      left: 0;
      width: 20%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
// 🚩not working
// .dialog-fade-enter-active,
// .dialog-fade-leave-active {
//   transition: opacity 2s;
// }
// .dialog-fade-enter-from,
// .dialog-fade-leave-to {
//   opacity: 0;
// }
</style>

