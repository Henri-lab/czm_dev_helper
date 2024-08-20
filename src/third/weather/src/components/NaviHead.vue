<template>
  <div class="naviHead">
    <header class="navi-head">
      <img class="pic1" src="../img/天气预报 (1).png" @click="home" />
      <div class="title" @click="home">开发中</div>
      <div class="weather-summary">
        <div class="location">{{ local }}</div>
        <span class="lives"
          >实时天气：&nbsp; {{ weather }}&nbsp; {{ temperature }}°C&nbsp;&nbsp;
          {{ winddirection }}风{{ windpower }}级</span
        >
      </div>
      <div class="alert">
        <button class="btn btn-i" @click="pop"><img class="pic2" src="../img/i.png" /></button
        >&nbsp;&nbsp;
        <div class="btn btn2" circle size="small" v-if="isShow" @click.stop="addCity">
          <img class="pic3" src="../img/+.png" />
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, computed } from 'vue'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'
import { useSearchStore } from '@/stores/searchStore'
import { useRouter, useRoute } from 'vue-router'
const weatherInfoStore = useWeatherInfoStore()
const searchStore = useSearchStore()
const router = useRouter()
const route = useRoute()
const local = ref('')
const adcode = ref('')
const weather = ref('')
const temperature = ref('')
const winddirection = ref('')
const windpower = ref('')

watchEffect(() => {
  local.value = weatherInfoStore.local
  weather.value = weatherInfoStore.weatherLive.weather
  temperature.value = weatherInfoStore.weatherLive.temperature
  winddirection.value = weatherInfoStore.weatherLive.winddirection
  windpower.value = weatherInfoStore.weatherLive.windpower
})

const requestLive = async () => {
  // console.log('头部组件调用')
  await weatherInfoStore.getLocalInfo()
  // console.log('头部组件调用')
  await weatherInfoStore.getCityAdcode(weatherInfoStore.local)
  // console.log('头部组件调用')
  adcode.value = weatherInfoStore.cityAdcode
  await weatherInfoStore.getWeatherLiveInfo(weatherInfoStore.cityAdcode)
}

onMounted(async () => {
  let count = 0
  // console.log('本地实时天气-首次请求')
  await requestLive()
  // 记录本地的adcode，方便后续使用
  weatherInfoStore.localCode = adcode.value
  // 每5分钟请求一次
  setInterval(async () => {
    count++
    // console.log(`本地实时天气-第${count}次请求`)
    await requestLive()
    weatherInfoStore.localCode = adcode.value
  }, 300000)
})

const home = () => {
  router.back()
  //weatherInfoStore中的记录只在查询后更新；
  //因此返回至home时手动更新weatherInfoStore中的状态，确保显示的页面城市与weatherInfoStore保持同步
  weatherInfoStore.cityName = local.value
  weatherInfoStore.cityAdcode = adcode.value
  // 改变首次添加
  searchStore.isfirst = 0
}

//添加按钮的显示
const isShow = computed(() => {
  // 标记：-设置路径的元数据-提供支持
  // 如果你去的是live路由，并且你查看live的城市不在cityList中，添加添加键显示；
  if (route.meta.enabled && !searchStore.isExist(route.params.cityName)) return true
  // 如果你去的是live路由，并且你查看live的城市在cityList中，但是是首次添加，添加添加键显示；
  else if (searchStore.isExist(route.params.cityName) && searchStore.isfirst) return true
  else return false
})

const addCity = () => {
  searchStore.add({
    adcode: searchStore.adcode
    // 🚩虽然searchStore.adcode来自weatherInfoStore.cityAdcode,但是add方法来自searchStore，所以选择；
  })
  // 声明为首次添加
  searchStore.isfirst = 1

  // ----------------------------------------------------------------------------------------------console.log('已经添加的城市名单：', searchStore.cityList)
  searchStore.setlocalStorage()
  // ----------------------------------------------------------------------------------------------console.log('已经更新localStorage')
  alert('添加成功') //------------------ ??📌这里发现在弹出框点击确认后localStorage才更新数据？？

  // 关闭添加键(上文已经将isShow与此值关联)
  searchStore.isfirst = 0
}

//弹出按钮控制根组件遮罩的显示
const pop = () => {
  searchStore.dialog = true
}
</script>

<style lang="scss" scoped>
.naviHead {
  width: 100%;
  height: 60px;
  background-color: var(--bcolor2);
  .navi-head {
    width: 960px;
    height: 60px;
    margin: 0 auto;
    background-color: transparent;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    .pic1 {
      width: 40px;
      margin-top: 15px;
    }
    .title {
      height: 40px;
      line-height: 40px;
      color: #e8e6e3;
      font-size: 32px;
      position: absolute;
      // background-color: aqua;
      top: 50%;
      transform: translate(0, -50%);
      left: 5%;
    }
    .weather-summary {
      width: 280px;
      height: 40px;
      line-height: 40px;
      color: #e8e6e3;
      position: absolute;
      // background-color: red;
      top: 50%;
      transform: translate(0, -50%);
      left: 25%;
      .location {
        position: absolute;
        font-size: 16px;
        left: -15px;
        // background-color: burlywood;
      }
      .lives {
        position: absolute;
        font-size: 12px;
        left: 50px;
        // background-color: rgb(221, 135, 23);
      }
    }
    .alert {
      display: flex;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      right: 0;
      .btn {
        border: 0;
        border-radius: 50%;
        background-color: white;
        .pic2 {
          margin-top: 10%;
          margin-left: 5%;
          width: 20px;
        }
        .pic3 {
          width: 20px;
        }
      }
      .btn2 {
        margin-top: 5%;
        text-align: center;
        background-color: transparent;
        opacity: 1;
        transition: all 1s;
      }
      .btn2:hover {
        opacity: 0;
        transition: all 1s;
        cursor: pointer;
      }
      .btn-i {
        opacity: 1;
        transition: all 1s;
      }
      .btn-i:hover {
        opacity: 0;
        transition: all 1s;
        cursor: pointer;
      }
    }
  }
}
</style>

<!-- space：\u00A0 -->
