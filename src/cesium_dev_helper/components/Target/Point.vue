<template></template>
<script setup>
import { EventManager } from '../../lib/Manager';
import { DataPrepocesser } from '../../lib/Data';
import DynamicColorProperty from '../../lib/Custom/Property/DynamicColorProperty';
import * as Cesium from 'cesium'
import { onBeforeUnmount, watch, createVNode, render } from 'vue';
import { mockPointsMillion } from '../../mock/points'
const $bus = inject('$bus')
const $bus_Entity = inject('$bus_Entity')
const layerNameProp = inject('layerNameProp')
let _editor_, _viewer_, _eM_, _lM_, _cM_, pointPrimitiveCollection
$bus.on('czmLayerEvent@henrifox', ({ viewer, editor, eM, lM, cM }) => {
    _viewer_ = viewer
    _editor_ = editor
    _eM_ = eM
    _lM_ = lM
    _cM_ = cM
    pointPrimitiveCollection = _viewer_.scene.primitives.add(new Cesium.PointPrimitiveCollection());
})
const props = defineProps({
    // 单个实体点渲染
    size: {
        type: Number,
        default: 100
    },
    position: {
        type: Object,
        default: () => Cesium.Cartesian3.fromDegrees(2.294481, 48.858370, 100)//eiffel tower
    },
    color: {
        type: String,
        default: ''
    },
    colors: {
        type: Object,
        default: {
            type: 'infinate',
            interval: 2,
            data: [
                {
                    value: 'red',
                    time: 0
                },
                {
                    value: 'green',
                    time: 2
                },
                {
                    value: 'blue',
                    time: 4
                },
            ]
        }
    },
    extraOpt: {
        type: Object,
        default: () => ({
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 3,
            scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 5000, 0.0),
            translucencyByDistance: new Cesium.NearFarScalar(1000, 1.0, 5000, 0.0),
            disableDepthTestDistance: 1000 // 在1000米内禁用深度测试
        })
    },
    zoom: {
        type: Boolean,
        default: false
    },
    three: {
        type: Boolean,
        default: false
    },
    // 大量图元点渲染
    performance: {
        type: Boolean,
        default: false
    },
    test: {
        type: Boolean,
        default: false
    },
    points: {
        type: Array,
        default: () => ([])
    },
    // 交互
})
let curSec = 0;
let timer1, timer2
let curEntity
let curDatasource
const parsedColor = (string) => {
    return Cesium.Color.fromCssColorString(string)
}
const createDynamicPropertyOfColor = (colorOptions) => {
    if (!colorOptions) return parsedColor('white');
    const { type, interval, data } = colorOptions;
    let colorDefinition = function (time) {  // 定义动态颜色变化函数
        const endTime = data[data.length - 1].time + interval
        for (let i = 0; i < data.length; i++) {
            const color = data[i];
            if (curSec < color.time) {
                return parsedColor(data[i == 0 ? data.length - 1 : i - 1].value);
            }
        }

        if (type && type.toLowerCase() == 'infinate' && curSec >= endTime) {
            curSec = curSec % endTime; // 模拟循环
        } else {
            // 如果没有设置无限循环，没有找到合适的颜色，返回最后一个颜色
            return parsedColor(data[data.length - 1].value);
        }

    }
    let dynamicColorProperty;
    colorDefinition && (dynamicColorProperty = new DynamicColorProperty(colorDefinition));// 动态颜色属性
    return dynamicColorProperty;
}

const createDynamicPoint = (_viewer_, layerName) => {
    if (!_viewer_) return
    pointPrimitiveCollection.removeAll();
    curDatasource = _lM_.getDatasourceByName(layerName) || _viewer_
    curEntity && curDatasource.entities.remove(curEntity)
    if (props.performance) { // 增加性能 图元
        let center
        if (props.test) {
            mockPointsMillion(pointPrimitiveCollection)     // 测试模式 生成million个示例点 
        }
        center = DataPrepocesser.getCenterOfPrimitives(pointPrimitiveCollection._pointPrimitives)
        props.zoom && _cM_.setViewSimple(center)
        curEntity = {
            name: 'point@henrifox',
            position: center,
            data: pointPrimitiveCollection._pointPrimitives
        };
    }
    else {
        if (!_viewer_) return;
        const entity = curDatasource.entities.add({
            properties: {
                meta: 'Some additional meta information',
                html: `<p>Point size is ${props.size}</p>`
            },
            name: 'Point@henrifox' + Date.now(),
            position: props.position,
            point: {
                pixelSize: props.size,
                color: props.color ?
                    parsedColor(props.color) :
                    createDynamicPropertyOfColor(props.colors), // 动态颜色属性
                ...props.extraOpt,
            },
        });
        curEntity = entity
        props.zoom && _viewer_.zoomTo(curEntity);
    }
    $bus_Entity.emit('entityCreatedEvent@henrifox', { target: curEntity, type: 'point' })
}
let pointVueDocClick
const bindEvent = (eM, type) => {
    if (type = 'popup') {
        pointVueDocClick = document.addEventListener('click', (e) => {
            if (e.target instanceof HTMLCanvasElement) {/**bug if (!e.target instanceof HTMLCanvasElement) */ }
            else $bus_Entity.emit('popupInfoEvent@henrifox', { isPicked: false })
        })
        eM.onMouseClick((e, pickedPos, pickedObject) => {
            if (Cesium.defined(pickedObject) && pickedObject.primitive instanceof Cesium.PointPrimitive) {
                // console.log('object picked.', pickedObject);
                // console.log('object picked.', pickedPos)
                const primitive = pickedObject.primitive;
                const entity = pickedObject.id;
                $bus_Entity.emit('popupInfoEvent@henrifox', { entity, primitive, pickedPos, isPicked: true })
            }
            else {
                $bus_Entity.emit('popupInfoEvent@henrifox', { isPicked: false })
                console.log('No object picked.');
            }
        }
        )
    }
}
onMounted(() => {
    timer1 = setInterval(() => {
        curSec++
    }, 1000)
    timer2 = setTimeout(() => {
        createDynamicPoint(_viewer_, layerNameProp)
        const eM_Point = new EventManager(_viewer_)//pointVue内部独立维护一个事件管理器
        bindEvent(eM_Point, 'popup')
    }, 0)
})
watch(() => props, (newV) => {
    setTimeout(() => {
        createDynamicPoint(_viewer_, layerNameProp)
    }, 0)
}, { deep: true })
onBeforeUnmount(() => {
    clearInterval(timer1)
    clearTimeout(timer2)
    pointVueDocClick && document.removeEventListener('click', pointVueDocClick)
    // 清空所有点图元和实体
    pointPrimitiveCollection.removeAll();
    curEntity && curDatasource.entities.remove(curEntity)
})
</script>