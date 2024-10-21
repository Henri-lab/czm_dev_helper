<template>
    <div>
        <!-- <fu>
            <son></son>
        </fu> -->


    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import fu from './fu.vue';
import son from './son.vue';
import * as THREE from 'three';
import * as Cesium from 'cesium';
import {
    getMaterial,
} from '@/cesium_dev_helper/lib/Custom/Materials';
onMounted(() => { console.log('test===================================================================================') })

onMounted(() => {
    if (0) {
        console.log(Cesium.Material.fromType('Water'), 'material-water-cesium')

        // console.log(matertial_water_custom, 'material-water-custom')
    }
})

onMounted(() => { console.log('===================================================================================test') })
</script>

<style lang="scss" scoped></style>