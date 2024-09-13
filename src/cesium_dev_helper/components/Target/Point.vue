<script setup>
import { EventManager } from '../../lib/Manager';
import { DataPrepocesser } from '../../lib/Data';
import DynamicColorProperty from '../../lib/Custom/Property/DynamicColorProperty';
import * as Cesium from 'cesium'
import { onBeforeUnmount, watch, createVNode, render } from 'vue';
const $bus = inject('$bus')
const $bus_Entity = inject('$bus_Entity')
const layerNameProp = inject('layerNameProp')
let _editor_, _viewer_, _eM_, _lM_, pointPrimitiveCollection
$bus.on('czmEntityEvent@henrifox', ({ viewer, editor, eM, lM }) => {
    _viewer_ = viewer
    _editor_ = editor
    _eM_ = eM
    _lM_ = lM
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
    }
})

let curSec = 0;
let timer1, timer2
let curEntity
let curDatasource
const createDynamicPoint = (_viewer_, layerName) => {

    if (props.performance) { // 增加性能 图元
        let primitiveArr = []
        let center
        if (props.test) {
            // 测试模式 生成100个示例点 
            const baseLongitude = 2.294481;//基准点 base
            const baseLatitude = 48.858370;
            const baseHeight = 20;
            const colorArray = [
                Cesium.Color.RED,
                Cesium.Color.GREEN,
                Cesium.Color.BLUE
            ];
            for (let i = 0; i < 10000; i++) {
                const longitudeOffset = (Math.random() - 0.5) * 0.01; // 经度偏移
                const latitudeOffset = (Math.random() - 0.5) * 0.01; // 纬度偏移
                const heightOffset = (Math.random() - 0.5) * 2000
                // 构建点的位置和颜色
                const position = Cesium.Cartesian3.fromDegrees(
                    baseLongitude + longitudeOffset,
                    baseLatitude + latitudeOffset,
                    baseHeight + heightOffset
                );
                // 随机选择颜色
                const color = colorArray[i % colorArray.length];
                // 添加点到集合
                let pointPrimitive = pointPrimitiveCollection.add({
                    position: position,
                    color: color,
                    pixelSize: 2 + Math.random() * 10,// 随机大小
                    scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 5000, 0.2),
                });
            }
        } else { // 普通实体
            props.points.forEach(point => {
                let pointPrimitive = pointPrimitiveCollection.add({
                    position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height),
                    color: point.color,
                    pixelSize: point.size,
                    ...props.extraOpt
                });
            });
        }
        center = DataPrepocesser.getCenterOfPrimitives(pointPrimitiveCollection._pointPrimitives)
        props.zoom && _viewer_.camera.setView({
            destination: center,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-45.0),
                roll: 0.0
            }
        });
        curEntity = curEntity = {
            name: 'point@henrifox',
            position: center,
            data: pointPrimitiveCollection._pointPrimitives
        };
    }
    else {
        const colorsProp = props.colors
        const positionProp = props.position
        if (!_viewer_) return;
        function parsedColor(string) {
            return Cesium.Color.fromCssColorString(string)
        }
        let colorDefinition = function (time) {  // 定义动态颜色变化函数
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
        let dynamicColorProperty;
        colorDefinition && (dynamicColorProperty = new DynamicColorProperty(colorDefinition));// 动态颜色属性
        curEntity && _viewer_.entities.remove(curEntity)
        curDatasource = _lM_.getDatasourceByName(layerName) || _viewer_

        const entity = curDatasource.entities.add({
            properties: {
                meta: 'Some additional meta information',
                html: `<p>Point size- - -${props.size}</p>`
            },
            name: 'Point@henrifox' + Date.now(),
            position: positionProp,
            point: {
                pixelSize: props.size,
                color: !props.color ? dynamicColorProperty : parsedColor(props.color), // 没有指定颜色 则使用动态颜色属性 ;动态属性不存在 则cesium使用默认白色
                ...props.extraOpt,
            },
        });
        curEntity = entity
        props.zoom && _viewer_.zoomTo(curEntity);
    }
    $bus_Entity.emit('entityCreatedEvent@henrifox', { target: curEntity, type: 'point' })
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
        createDynamicPoint(_viewer_, layerNameProp)
        const eM_Point = new EventManager(_viewer_)//pointVue内部独立维护一个事件管理器
        bindEvent(eM_Point, 'popup')
    }, 0)
})

watch(() => props, (newV) => {
    setTimeout(() => {
        curDatasource = _lM_.getDatasourceByName(layerNameProp) || _viewer_
        curEntity && curDatasource.entities.remove(curEntity)
        createDynamicPoint(_viewer_, layerNameProp)
    }, 0)
}, { deep: true })

onBeforeUnmount(() => {
    clearInterval(timer1)
    clearTimeout(timer2)
    // 清空所有点图元

})
</script>

<style lang="scss" scoped></style>