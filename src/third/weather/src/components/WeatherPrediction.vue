<template>
  <div class="weatherPrediction">
    <span class="title">近期天气</span>
    <div class="predict">
      <ul class="list">
        <li class="dayweather" v-for="(item, index) in predictions" :key="index">
          <span class="day" v-if="index !== 0 && index !== 1">{{ item.day }}</span>
          <span class="day" v-if="index === 0">今天</span>
          <span class="day" v-if="index === 1">明天</span>
          <span class="date">{{ item.date }}</span>
          <span class="weather">{{ item.dayweather }}</span>
          <span class="power">风力&nbsp;{{ item.daypower }}级</span>
        </li>
      </ul>
      <div class="chart">
        <v-chart :option="option" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'
import { useRoute } from 'vue-router'
import getFormatDay from '@/util/format/getFormatDay'

const weatherInfoStore = useWeatherInfoStore()
const route = useRoute()

const predictions = ref([])
const dayT = ref([])
const nightT = ref([])
const option = ref({})

const adcodeFromRoute = computed(() => route.params.adcode)
const localCode = computed(() => weatherInfoStore.localCode)

watch(
  () => localCode.value,
  async () => {
    //avoid在live页面刷新的时候会读取本地的数据----!
    if (route.meta.name === 'home') {
      // console.log('本地天气预报~loading ')
      await loadData(localCode.value)
      renderChart(dayT, nightT)
    }
  }
)

// 根据城市名称获得天气预报数据
const getData = async (adcode) => {
  //store1的状态已经和页面保持同步：1.跳转会请求，请求则会更新；2.返回home已经时手动更新store1的状态；
  //获得当前页面城市的天气预报-直接使用store1中的数据，避免冗余请求
  // console.log('预告组件调用')
  await weatherInfoStore.getWeatherPredictionInfo(adcode)
  //处理并返回新天气预报数据
  return weatherInfoStore.weatherPrediction.map((item) => {
    const day = getFormatDay(item.date).replace('星期', '周')
    const date = new Date(item.date)
    const formattedDate = (date.getMonth() + 1 + '-' + date.getDate()).padStart(2, '0')
    return {
      day,
      date: formattedDate,
      daytemp: item.daytemp,
      nighttemp: item.nighttemp,
      dayweather: item.dayweather,
      daypower: item.daypower
    }
  })
}
// 加载数据到本地
const loadData = async (adcode) => {
  predictions.value = await getData(adcode)
  dayT.value = predictions.value.map((item) => item.daytemp)
  nightT.value = predictions.value.map((item) => item.nighttemp)
}

watch(
  () => route.meta.name,
  async (routeName) => {
    if (routeName === 'home') {
      //返回home时加载天气预报
      // console.log('本地天气预报~loading ')
      await loadData(localCode.value)
      renderChart(dayT, nightT)
    } else if (routeName === 'live') {
      //跳转live时加载天气预报
      // console.log('普通天气预报~loading ')
      await loadData(adcodeFromRoute.value)
      renderChart(dayT, nightT)
    }
  }
)

//
const renderChart = (v1, v2) => {
  option.value = {
    xAxis: {
      type: 'category',
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    series: [
      {
        name: 'daytemp',
        data: v1,
        type: 'line',
        smooth: true,
        label: {
          show: true, // Shows data value at each point on the line
          position: 'top',
          //'c'
          formatter: '白{c}℃',
          fontSize: 10
        }
      },
      {
        name: 'nighttemp',
        data: v2,
        type: 'line',
        smooth: true,
        label: {
          show: true,
          position: 'top',
          formatter: '晚{c}℃',
          fontSize: 10
        }
      }
    ],
    grid: {
      show: false,
      height: 'auto',
      top: 20,
      right: 0,
      bottom: 0,
      left: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.weatherPrediction {
  width: 960px;
  height: 380px;
  margin: 0 auto;
  padding-top: 20px;
  position: relative;
  .predict {
    width: 100%;
    height: 340px;
    background-color: var(--bcolor2);
    .list {
      display: flex;
      width: 100%;
      height: 150px;
      margin-top: 20px;
      list-style: none;
      flex-direction: row;
      justify-content: space-evenly;
      .dayweather {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-top: 30px;
        text-align: center;
        height: 100px;
        font-size: 18px;
        color: antiquewhite;
      }
    }
    .chart {
      width: 100%;
      height: 180px;
    }
  }
  .title {
    position: absolute;
    top: 20px;
    color: darkgrey;
  }
  .title:hover {
    color: rgb(93, 228, 160);
  }
}
</style>
