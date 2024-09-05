<template>
    <div class="ex1" style="display: flex;">
        <div class="code" ref="code"
            style="color:antiquewhite; background-color: rgb(25, 27, 22); width: 50%; height: 20%; overflow: scroll; font-size: 16px;">
        </div>
        <CzmMap>
            <CzmCamera :view="view"></CzmCamera>
            <CzmEditor></CzmEditor>
        </CzmMap>
    </div>
</template>

<script setup>
import { marked } from 'marked'
import codeString from './code.js'
import { CzmEditor, CzmMap, CzmCamera } from '../../components'

const view = {
    destination: {
        longitude: 17,
        latitude: 23,
        height: 2000,
    },
    heading: 0,
    pitch: -90,
    roll: 0,
}






















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