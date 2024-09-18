
<template>
    <div class="ex1" style="display: flex;">
        <div class="code" ref="code"
            style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
        </div>

        <CzmMap width="800px" height="1000px">
            <CzmCtx></CzmCtx>
            <Three></Three>
        </CzmMap>
    </div>
</template>

<script setup>
import { marked } from 'marked'
import codeString from './code.js'
import { CzmCtx, CzmMap, Three } from '../../components'


const code = ref(null)

const md = marked(`
\`\`\` js
${codeString}
\`\`\`
`)
onMounted(() => {
    code.value.innerHTML = md
})

</script>

<style lang="scss" scoped></style>