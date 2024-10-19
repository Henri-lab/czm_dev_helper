
<template>
    <div class="ex1" style="display: flex;">
        <CzmMap width="1600px" height="1000px">
            <Particle></Particle>
        </CzmMap>
        <CodeEditor :value="codeString" style="width: 1600px;height: 500px;"></CodeEditor>

    </div>
</template>

<script setup>

import codeString from './code.js'
import { CzmMap, Particle } from '../../components'
import CodeEditor from '@/components/CodeEditor/index.vue'


const code = ref(null)


onMounted(() => {
})

</script>

<style lang="scss" scoped></style>