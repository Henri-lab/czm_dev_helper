import { ref } from 'vue'
import { defineStore } from 'pinia'
import { regeoByCoordinates } from '@/api'

// 管理根据鼠标hover的经纬度信息返回的接口数据
export const useMouseStore = defineStore('MouseStore', () => {
    // -----反投影后的鼠标经纬坐标-----
    const mouseJing = ref(0)
    const mouseWei = ref(0)
    const mouseCity = ref(null)


    // API
    const getMouseCity = async (jing, wei) => {
        // 不超过6位小数 api规定
        const city = await regeoByCoordinates(jing, wei, 'city')
        if (city == []) {
            const directProvince = await regeoByCoordinates(mouseJing.value, mouseWei.value, 'province')
            directProvince && (mouseCity.value = directProvince)
        } else mouseCity.value = city
    }


    return {
        mouseJing,
        mouseWei,
        mouseCity,
        getMouseCity,
    }
})