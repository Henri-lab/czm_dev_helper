<template>
    <div class="model@henrifox"></div>
</template>

<script setup>
import { inject, watch } from 'vue';
import { DataPrepocesser } from '../../lib/Data';

const $bus = inject('$bus');
let _dP, _sM, _cM, _eM, _effecter, _editor
let collapseFn
$bus.on('czmEffectEvent@henrifox', (helpers) => {
    const { dP, sM, cM, eM, effecter, editor } = helpers
    _dP = dP
    _sM = sM
    _cM = cM
    _eM = eM
    _effecter = effecter
    _editor = editor
    collapseFn = _effecter.useBuildingEffect('collapse')
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
    },
    zoom: {
        type: Boolean,
        default: true
    }
})

let timer
let _model_, _callback_
onMounted(() => {
    timer = setTimeout(async () => {
        // 添加模型
        // 异步添加
        if (props.option) {
            _callback_ = (resArr) => {
                console.log(resArr, '<Model> :loaded models')
                _model_ = resArr[0].model;
                (props.option.extra.transform) &&
                    (props.option.extra.matrix) &&
                    DataPrepocesser.update3DtilesMaxtrix(_model_, props.option.extra.matrix)
            }
            props.zoom && (props.option.extra.isZoom = true)
            await _sM.add3DModel(props.option.type, props.option.model, props.option.extra, _callback_)
        }
        clearTimeout(timer)
    }, 0)
})

watch(
    () => props.tileset,
    (loaded) => {
        // 直接添加
        loaded &&
            console.log(loaded, '<Model> :tileset') &&
            _sM.addToScene(loaded, '3dtiles') &&
            _cM.flyTo(loaded)

    },
)


watch(() => props.collapse,
    (n, o) => {
        collapseFn(_model_, null, !n)

        // if (n) {
        //     console.log('model collapse!')
        // } else {
        //     console.log('model reset!')
        // }

    },
)










</script>

<style lang="scss" scoped></style>