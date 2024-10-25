<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;flex-direction: row;">
            <div class="btns" style="display: flex;flex-direction:column;position: absolute;z-index: 100;">
                <el-button @click="handleSize('+')" v-show="isBtn">增加半径</el-button>
                <el-button @click="handleSize('-')" v-show="isBtn">减小半径</el-button>
                <br>
                <el-button @click="handlePerformance">百万级渲染</el-button>
            </div>
            <CzmMap width="1600px" height="1000px">
                <Entity layerName="ex-entity:geojson" draggable>
                    <Point :position="position" :extraOpt="extraOpt" zoom/>
                </Entity>
            </CzmMap>
        </div>
        <CodeEditor :value="codeString" style="width: 1600px;height: 500px;"></CodeEditor>

    </div>
</template>

<script setup>
import { Point, CzmMap, Entity, Material } from '../../components'
import codeString from './code.js'
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium';
import axios from 'axios'
import CodeEditor from '@/components/CodeEditor/index.vue'

const position = ref(
    [116.404, 39.915]
    )
</script>