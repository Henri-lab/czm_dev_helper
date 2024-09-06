<template>
    <div class="building@henrifox">

    </div>
</template>

<script setup>
import { inject, watch } from 'vue';

const $bus = inject('$bus');
let _dP, _sM, _cM, _eM, _effecter, _editor
$bus.on('czmEffectEvent@henrifox', (helpers) => {
    const { dP, sM, cM, eM, effecter, editor } = helpers
    _dP = dP
    _sM = sM
    _cM = cM
    _eM = eM
    _effecter = effecter
    _editor = editor
})
const props = defineProps({
    option: {
        type: Object,
        default: null,
    },
    tileset: {
        type: Object,
        default: null,
    },
    collapse: {
        type: Boolean,
        default: false
    }

})

let timer
let _building_, _callback_
onMounted(() => {
    timer = setTimeout(async () => {
        // 添加模型
        // 异步添加
        if (props.option) {
            _callback_ = (resArr) => {
                console.log(resArr, '<Building> :loaded building')
                _building_ = resArr[0].model
                props.option.extra.matrix && _dP.update3DtilesMaxtrix(_building_, props.option.extra.matrix)
            }
            await _sM.add3DModel(props.option.type, props.option.building, props.option.extra, _callback_)
        }
        clearTimeout(timer)
    }, 0)
})

watch(
    () => props.tileset,
    (loaded) => {
        // 直接添加
        loaded &&
            console.log(loaded, '<Building> :tileset') &&
            _sM.addToScene(loaded, '3dtiles') &&
            _cM.flyTo(loaded)

    },
)


watch(() => props.collapse,
    (n, o) => {
        if (n) {
            console.log('building collapse!')
        }
    },
)










</script>

<style lang="scss" scoped></style>