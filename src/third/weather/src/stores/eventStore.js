import { defineStore } from 'pinia'

import { ref } from 'vue'

export const useEventStore = defineStore('EventStore', () => {
    let isClick_zoomTo_Triggered = ref(false)
    let isclick_isMapClicked_Triggered = ref(false)


    return {
        isClick_zoomTo_Triggered,
        isclick_isMapClicked_Triggered,
    }
})