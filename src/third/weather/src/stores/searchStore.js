import { ref } from 'vue'
import { defineStore } from 'pinia'
import localStorageManager from '@/util/localStorageManager'
import { getWeatherLive } from '@/api'


export const useSearchStore = defineStore('SearchStore', () => {

    //dialoge
    const dialog = ref(false)

    //添加的城市
    //cityList:searched+recorded
    const cityList = ref([])
    const adcode = ref('')//添加cityList预备-由weatherLive组件提供数据源
    const isfirst = ref(0)//判断是否首次添加

    // 判断是否已经存在
    const isExist = (cityName) => {
        return cityList.value.some(item => (item.cityName === cityName))
    }

    const add = (city) => {
        // 列表已经存在该城市
        if (cityList.value.some(item => (item.cityName === city.cityName))) return
        else cityList.value.push(city)
    }
    const del = (cityName) => {
        cityList.value = cityList.value.filter(item => (item.cityName !== cityName))
    }
    const setAdcode = (c) => {
        adcode.value = c
    }
    // 本地存储
    const getlocalStorage = async () => {
        cityList.value = []  // 🚩
        localStorageManager('get', 'searchWeatherLiveMoudle-', cityList.value)
        // 获得数据的时候只关注存储城市的adcode，然后更新补全其其他天气信息
        cityList.value = await Promise.all(cityList.value.map(async (item) => {
            const res = await getWeatherLive(item.adcode)
            const pres = res.data.lives[0]
            switch (pres.weather) {
                case '晴':
                    return {
                        mark: "🤗",
                        cityName: pres.city,
                        adcode: pres.adcode,
                        weather: pres.weather,
                        temperature: pres.temperature,
                        winddirection: pres.winddirection,
                        windpower: pres.windpower
                    }
                case "大雨":
                case "雷阵雨":
                case '暴雨':
                case "大暴雨":
                case "特大暴雨":
                case "大到暴雨":
                case "暴雨到大暴雨":
                case "大暴雨到特大暴雨":
                    return {
                        mark: "😭",
                        cityName: pres.city,
                        adcode: pres.adcode,
                        weather: pres.weather,
                        temperature: pres.temperature,
                        winddirection: pres.winddirection,
                        windpower: pres.windpower
                    }
                case '多云':
                case "阴":
                case "小雨":
                case "中雨":
                    return {
                        mark: "😔",
                        cityName: pres.city,
                        adcode: pres.adcode,
                        weather: pres.weather,
                        temperature: pres.temperature,
                        winddirection: pres.winddirection,
                        windpower: pres.windpower
                    }
                case "冻雨":
                case "大雪":
                case "暴雪":
                case "大到暴雪":
                    return {
                        mark: "🥶",
                        cityName: pres.city,
                        adcode: pres.adcode,
                        weather: pres.weather,
                        temperature: pres.temperature,
                        winddirection: pres.winddirection,
                        windpower: pres.windpower
                    }
                case '重度霾':
                case "严重霾":
                case "中度霾":
                case "强沙尘暴":
                    return {
                        mark: "😷",
                        cityName: pres.city,
                        adcode: pres.adcode,
                        weather: pres.weather,
                        temperature: pres.temperature,
                        winddirection: pres.winddirection,
                        windpower: pres.windpower
                    }
                default:
                    return {
                        mark: "",
                        cityName: pres.city,
                        adcode: pres.adcode,
                        weather: pres.weather,
                        temperature: pres.temperature,
                        winddirection: pres.winddirection,
                        windpower: pres.windpower
                    };

            }
        }
        ))

        // console.log(cityList.value, 'cityList')
    }
    const setlocalStorage = () => {
        localStorageManager('set/random', 'searchWeatherLiveMoudle-', cityList.value)
    }

    return {
        dialog,
        cityList,
        adcode,
        isfirst,
        isExist,
        add,
        del,
        setAdcode,
        setlocalStorage,
        getlocalStorage
    }
})