<template>
  <div class="citySearch">
    <input
      type="text"
      placeholder="请输入城市名称"
      class="input"
      :class="{ active: isShow }"
      v-model="value"
      @input="enWatch"
    />
    <div class="select" :class="{ expand: isShow3 }">
      <!-- 假如只返回一个城市 -->
      <div class="cityName" @click="search">{{ cityName }}</div>
    </div>
    <div class="list">
      <ul>
        <li
          @mouseenter="select(index)"
          @mouseleave="cancel()"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="record">
            <div class="topo">{{ item.cityName }}{{ item.mark }}</div>
            <div class="temp">{{ item.temperature }}度</div>
            <div class="operate" v-show="isShow2 === index">
              <button class="check" @click="checkCity(item)">查看</button>
              <button class="delete" @click="delCity(item.cityName)">删除</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useWeatherInfoStore } from '../stores/weatherInfoStore'
import { useSearchStore } from '@/stores/searchStore'
import { useRouter } from 'vue-router'

const weatherInfoStore = useWeatherInfoStore()
const searchStore = useSearchStore()
const router = useRouter()
const document = window.document

const value = ref('')
const isShow = ref(false) //控制輸入框是否高亮
const isShow2 = ref(-1) //控制表格操作是否挂载
const isShow3 = ref(false) //控制搜索結果列表是否展开

const cityName = ref('')
let ableWatch = 0 //watch 标志位
const list = computed(() => searchStore.cityList)

// enWatch 合理化watch频率
const enWatch = () => {
  ableWatch = 1
}

//根据输入框内容返回城市fullName
watch(
  () => value.value,
  (city_input_new) => {
    if (ableWatch) {
      //可以回调,查找输入城市的相关信息
      // ------------------------------------------------------------------console.log('搜索组件调用')
      weatherInfoStore.getCityAdcode(city_input_new).then(() => {
        if (weatherInfoStore.cityAdcode) {
          // 根据输入的城市名称找到了adcode,城市fullName
          cityName.value = weatherInfoStore.cityName
          // 展开查询界面
          isShow3.value = true
        } else {
          // console.log('match error')
          // 展开查询界面
          cityName.value = '似乎没有找到你查找的城市'
          isShow3.value = true
          //一段时间后关闭查询界面
          setTimeout(() => {
            isShow3.value = false
          }, 5000)
        }
      })
      ableWatch = 0
    }
  }
)

onMounted(() => {
  // 刷新页面加载已经添加的城市
  searchStore.getlocalStorage()
  document.addEventListener('click', active)
})

//点击输入表单的城市选项跳转到相应城市的weatherLive
//--在路由中记录查看城市的名称和adcode
//--@weatherInfoStore更新时间：在搜索表单返回城市的fullName之前一丢丢
//--没有找到您输入的城市时，已经在@weatherInfoStore中设置为:cityName、adcode置为 '' ；
const search = () => {
  if (!weatherInfoStore.cityName)
    // 没搜索到了对应的城市
    alert('>_< 查询失败~~~~')
  else {
    //搜到了
    if (typeof weatherInfoStore.cityName !== 'string') alert('>_< 查询失败')
    else {
      router.push({
        name: 'live',
        params: {
          adcode: weatherInfoStore.cityAdcode,
          cityName: weatherInfoStore.cityName
        }
      })
    }
  }
}

const checkCity = (item) => {
  // 跳转到相应城市的weatherLive
  // 🚩传递链：citySearchVue提供weatherInfoStore.cityAdcode---->route.params.adcode被weatherLiveVue使用；
  //citySearchVue与weatherLiveVue有路由的交流，耦合在一起🔥
  router.push({
    name: 'live',
    params: {
      adcode: item.adcode,
      cityName: item.cityName
    }
  })
}

const delCity = (cityName) => {
  alert('确认删除')
  searchStore.del(cityName)
  searchStore.setlocalStorage()
  searchStore.getlocalStorage()
  // ---------------------------------------------------------------------------------------------------------------console.log('已经更新城市页面')
}

//输入框样式
const active = (e) => {
  //如果你点击的是input框
  if (e.target.classList.contains('input')) {
    isShow.value = true
    weatherInfoStore.cityName !== '武汉市' && (cityName.value = weatherInfoStore.cityName)
    isShow3.value = true
  } else {
    isShow.value = false
    // 清空搜索框
    cityName.value = ''
    isShow3.value = false
  }
}

// 表格操作的顯示--經典排他
const select = (index) => {
  isShow2.value = index
}
const cancel = () => {
  isShow2.value = -1
}
</script>

<style lang="scss" scoped>
.citySearch {
  width: 960px;
  margin: 0 auto;
  //   background-color: aqua;
  .input {
    width: 100%;
    height: 30px;
    border: 0;
    border-bottom: 1px solid grey;
    background-color: rgba(0, 82, 110, 0);
    padding: 8px, 4px;
    margin: 15px 0;
    outline: none;
  }
  .select {
    height: 0;
    overflow: hidden;
  }
  .select.expand {
    width: 100%;
    height: auto;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    //优化：自适应高度
    background-color: rgba(7, 179, 236, 0.5);
    margin-top: -10px;
    .cityName {
      width: 100%;
      font-size: 14px;
    }
    .cityName:hover {
      background-color: yellow;
    }
  }

  .active {
    border-bottom-color: deepskyblue;
  }
  .list {
    width: 960px;
    ul {
      width: 100%;
      list-style: none;
      li {
        width: 100%;
        // background-color: red;
        .record {
          width: 100%;
          height: 25px;
          margin: 5px 0;
          background-color: var(--bcolor2);
          position: relative;
          animation: growWidth 1s forwards;
          .topo {
            width: auto;
            position: absolute;
            top: 2px;
            left: 1%;
          }
          .temp {
            width: auto;
            position: absolute;
            top: 2px;
            right: 1%;
          }
          .operate {
            display: flex;
            position: absolute;
            left: 53.5em;
            background-color: var(--bcolor);
            button {
              width: 50px;
              height: 25px;
              margin-right: 4px;
              background-color: rgb(102, 84, 3);
              border: 0;
            }
            .check:hover {
              color: blue;
            }
            .delete:hover {
              color: red;
            }
          }
        }
        .record:hover {
          width: 80%;
          margin-left: 0;
          color: aquamarine;
          animation: fadeWidth 1s forwards;
        }
        @keyframes growWidth {
          0% {
            width: 80%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes fadeWidth {
          0% {
            width: 89%;
          }
          30% {
            width: 89%;
          }
          100% {
            width: 80%;
          }
        }
      }
    }
  }
}
</style>
