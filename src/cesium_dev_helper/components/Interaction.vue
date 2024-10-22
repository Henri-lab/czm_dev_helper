<template>
    <div class="interaction@henrifox"></div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import * as Cesium from 'cesium';
import { LayerManager } from '../type';

const props = defineProps({
    layerName: {
        type: String,
        default: ''
    }
})
let _lm_//layer manager
const $bus: any = inject('$bus')
const layerNameOfEntity = inject('layerNameProp')


$bus.on('czmLayerEvent@henrifox', (lm: LayerManager) => {
    _lm_ = lm
})

onMounted(() => {
})

</script>
