import { ref } from 'vue'
import { defineStore } from 'pinia'
import localStorageManager from '@/util/localStorageManager'

export const useCityHotStore = defineStore('CityHotStore', () => {
    // city:{ "id","spell,"name"}

    const currentCity = ref('')
    const positionCity = ref('')
    const cityVisitedList = ref([])//最近访问-本地存储
    const hotCityList = ref([])//热门城市

    const isExist = (cityName) => {
        return cityVisitedList.value.some(item => (item.name === cityName))
    }
    const add = (cityName) => {
        if (cityVisitedList.value.some(item => (item.name === cityName))) return
        else cityVisitedList.value.push(city)
    }
    const del = (cityName) => {
        cityVisitedList.value = cityVisitedList.value.filter(item => (item.name !== cityName))
    }
    const getlocalStorage = () => {
        cityVisitedList = []
        localStorageManager('set', 'cityVisitedMoudle-', cityVisitedList)

    }
    const setlocalStorage = () => {
        localStorageManager('get', 'cityVisitedModule-', cityVisitedList)
    }

    return {
        currentCity,
        positionCity,
        cityVisitedList,
        hotCityList,
        isExist,
        add,
        del,
        getlocalStorage,
        setlocalStorage
    }
})