<template>
    <slot></slot>
    <slot></slot>
    <div class="popup@henrifox" v-mouse-follow>
        <slot name="popup" :isPicked="_isPicked_" :entity="_entity_" :primitive="_primitive_" :test="test" />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import mitt from 'mitt';
import * as Cesium from 'cesium';
let test = 'this is a test popup'
const $bus_Entity = mitt()
provide('$bus_Entity', $bus_Entity)

let _entity_ = ref(new Cesium.Entity()), _primitive_ = ref(new Cesium.Primitive()), _isPicked_ = ref(false)
$bus_Entity.on('popupInfoEvent@henrifox', (pick) => {
    const { entity, primitive, isPicked } = pick
    // console.log('popupInfoEvent@henrifox', entity, primitive,isPicked)
    _entity_.value = entity
    _primitive_.value = primitive
    _isPicked_.value = isPicked
})
$bus_Entity.on('entityCreatedEvent@henrifox', ({ entity }) => {
    $bus_Entity.emit('materialEvent@henrifox', entity)
})

</script>

<style lang="scss" scoped></style>