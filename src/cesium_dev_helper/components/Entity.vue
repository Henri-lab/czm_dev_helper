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
import { EntityDragger } from '../lib/Interaction';
import DataFormator from '../lib/Data/DataFormator';


const props = defineProps({
    layerName: {
        type: String,
        default: ''
    },
    draggable: {
        type: Boolean,
        default: false
    }
})

let test = 'this is a test popup'
const $bus = inject('$bus')
const $bus_Entity = mitt()
$bus.on('czmLayerEvent@henrifox', ({ viewer, lM }) => {
    if (!props.layerName) return
    const specialLayer = lM.addDatasourceByName(props.layerName)
    //拖拽实体功能开启
    if (props.draggable) {
        const dragger = new EntityDragger(viewer, specialLayer)
        dragger.enable()
    }
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
    if (target instanceof Cesium.Entity) {
        const parsed = DataFormator.cesiumEntityToGeoJSON(target)
        // 将 geojson 对象转换为字符串
        const geojson = JSON.stringify(parsed, null, 2);
        console.log(geojson, 'geojson')
        // alert(geojson);
    }
    $bus_Entity.emit('materialEvent@henrifox', { target, type, isPrimitive })
})

</script>
