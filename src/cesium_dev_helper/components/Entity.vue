<template>
    <slot></slot>
    <slot class="popup@henrifox" name="popup" :isPicked="_isPicked_" :entity="_entity_" :primitive="_primitive_"
        :test="test" />
</template>

<script setup>
import { onMounted } from 'vue';
import mitt from 'mitt';
import * as Cesium from 'cesium';
import { provide } from 'vue';
const props = defineProps({
    layerName: {
        type: String,
        default: ''
    }
})

let test = 'this is a test popup'
const $bus = inject('$bus')
const $bus_Entity = mitt()
$bus.on('czmEntityEvent@henrifox', ({ lM }) => {
    if (!props.layerName) return
    lM.addDatasourceByName(props.layerName)
})

provide('$bus_Entity', $bus_Entity)
provide('layerNameProp', props.layerName)



let _entity_ = ref(new Cesium.Entity()), _primitive_ = ref(new Cesium.Primitive()), _isPicked_ = ref(false)
$bus_Entity.on('popupInfoEvent@henrifox', (pick) => {
    const { entity, primitive, isPicked } = pick
    // console.log('popupInfoEvent@henrifox', entity, primitive,isPicked)
    _entity_.value = entity
    _primitive_.value = primitive
    _isPicked_.value = isPicked
})
$bus_Entity.on('entityCreatedEvent@henrifox', ({ target, type, isPrimitive }) => {
    $bus_Entity.emit('materialEvent@henrifox', { target, type, isPrimitive })
})

</script>
