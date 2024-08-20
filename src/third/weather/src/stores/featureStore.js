
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFeaturesByAdcodeByAliyun } from '@/api'


export const useFeatureStore = defineStore('FeatureStore', () => {

    let currentAdcodeLevel = ref(0)
    let currentAdcodeNextLevel = ref(0)


    // 根据adcode请求一个features数组
    const getNextLevelByAdcode = async (adcode) => {
        const features = await getFeaturesByAdcodeByAliyun(adcode);
        return features;
    }


    return {
        currentAdcodeLevel,
        currentAdcodeNextLevel,
        getNextLevelByAdcode,
    }
})