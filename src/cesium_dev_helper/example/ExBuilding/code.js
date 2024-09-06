export default
    `
<template>
    <div class="ex2">
        <el-button @click="handleCollapse">坍塌切换</el-button>
        <CzmMap width="100%" height="80%">
            <Building 
              :option="option" 
              :collapse="collapse">
            </Building>
        </CzmMap>
    </div>
</template>

<script setup>
import { Building, CzmMap } from '../../components'
import { onMounted, ref } from 'vue'
//楼房数据
const option ={
    type: '3dtiles',
    building: {
        url: '/static/3dtiles/Tile_+002_+005/tileset.json',
    },
    extra: {
        matrix: {//加载后自动校正模型位置
            tx: 0,
            ty: 0,
            tz: -70,
            rx: 0,
            ry: 0,
            rz: 0,
            scale: 1.3,
        },
        isZoom: true//加载后自动缩放至模型
    },
}
//楼房坍塌切换
const collapse = ref(false)
const handleCollapse = () => {
    collapse.value = !collapse.value
}
</script>
`