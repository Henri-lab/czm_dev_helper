<script setup>
import DynamicColorProperty from '../../lib/Custom/Property/DynamicColorProperty';
import * as Cesium from 'cesium'
import { onBeforeUnmount, watch, createVNode, render } from 'vue';
const $bus = inject('$bus')
const $bus_Entity = inject('$bus_Entity')
let _editor_, _viewer_, _eM_
$bus.on('czmEntityEvent@henrifox', ({ viewer, editor, eM }) => {
    _viewer_ = viewer
    _editor_ = editor
    _eM_ = eM
})

const props = defineProps({
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
        default: null
    },
    colors: {
        type: Object,
        default: null
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
        default: true
    },
    three: {
        type: Boolean,
        default: false
    },


})

let curSec = 0;
let timer1, timer2
let curEntity
const createDynamicPoint = (_viewer_) => {
    const colorsProp = props.colors
    const positionProp = props.position
    if (!_viewer_) return;

    function parsedColor(string) {
        return Cesium.Color.fromCssColorString(string)
    }
    // 定义动态颜色变化函数
    let colorDefinition = function (time) {
        if (!colorsProp) return;
        const colorsData = colorsProp.data;
        const endTime = colorsData[colorsData.length - 1].time + colorsProp.interval
        for (let i = 0; i < colorsData.length; i++) {
            const color = colorsData[i];
            if (curSec < color.time) {
                return parsedColor(colorsData[i == 0 ? colorsData.length - 1 : i - 1].value);
            }
        }

        if (colorsProp.type && colorsProp.type.toLowerCase() == 'infinate' && curSec >= endTime) {
            curSec = curSec % endTime; // 模拟循环
        } else {
            // 如果没有设置无限循环，没有找到合适的颜色，返回最后一个颜色
            return parsedColor(colorsData[colorsData.length - 1].value);
        }

    }
    // 创建一个动态颜色属性
    let dynamicColorProperty;
    colorDefinition && (dynamicColorProperty = new DynamicColorProperty(colorDefinition));
    // 添加一个带有动态颜色的实体
    curEntity && _viewer_.entities.remove(curEntity)
    const entity = _viewer_.entities.add({
        // meta:'可以直接添加新的字段',
        properties: {
            meta: 'Some additional meta information',
            html: `<p>Point size- - -${props.size}</p>`
        },
        name: 'Point@henrifox' + Date.now(),
        position: positionProp,

        // billboard: {
        //     image: 'src/assets/images/system/bg.png', // 替换为您的图片路径
        //     width: 300,
        //     height: 160,
        //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER
        // },
        point: {
            pixelSize: props.size,
            color: !props.color ? dynamicColorProperty : parsedColor(props.color), // 没有指定颜色 则使用动态颜色属性 ;动态属性不存在 则cesium使用默认白色
            ...props.extraOpt,
        },
    });
    curEntity = entity
    $bus_Entity.emit('entityCreatedEvent@henrifox', { entity, type: 'point' })
    props.zoom && _viewer_.zoomTo(entity);
    // 确保 Cesium 渲染循环正确地更新颜色
    _viewer_.scene.preRender.addEventListener(function (scene, time) {
        // 强制更新属性值
        dynamicColorProperty.getValue(time);
    });
}

let descNode
let descDom = document.createElement('div');
const bindEvent = (eM, type) => {
    if (type = 'popup') {
        eM.onMouseDoubleClick((e, pickedObjectPos, pickedObject) => {
            if (Cesium.defined(pickedObject)) {
                if (pickedObject.primitive instanceof Cesium.PointPrimitive) {
                    const primitive = pickedObject.primitive;
                    const entity = pickedObject.id;
                    $bus_Entity.emit('popupInfoEvent@henrifox', { entity, primitive, isPicked: true })
                    // console.log('Picked a point primitive', primitive, entity);
                    // const container = document.getElementById('czm-container@henrifox');
                    // descNode = createVNode('div', {
                    //     style: {
                    //         color: 'red',
                    //         backgroundColor: 'black',
                    //         directives: [{ name: 'mouse-follow' }]
                    //     }
                    // }, `<p>Point size - ${props.size}</p>`)
                    // container.appendChild(descDom)
                    // render(descNode, descDom)
                }
            } else {
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
        createDynamicPoint(_viewer_)
        bindEvent(_eM_, 'popup')
    }, 0)
})
watch(() => props, (newV) => {

    curEntity && _viewer_.entities.remove(curEntity)
    createDynamicPoint(_viewer_)
}, { deep: true })

onBeforeUnmount(() => {
    clearInterval(timer1)
    clearTimeout(timer2)
})
</script>

<style lang="scss" scoped></style>