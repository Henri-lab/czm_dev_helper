<template></template>
<script setup>
import { onBeforeUnmount } from 'vue';
import { onMounted } from 'vue';
import { inject } from 'vue';
import * as Cesium from 'cesium'

const $bus = inject('$bus')
const layerNameProp = inject('layerNameProp')
let _viewer_, collection

const props = defineProps({
    options: {
        type: Array,
        default: () => []
    },
    center: {
        type: Object,
        default: () => ({})
    },
    zoom: {
        type: Boolean,
        default: true
    },
    fly: {
        type: Boolean,
        default: true
    },
    collection: {
        type: Cesium.LabelCollection,
        default: null
    },
    cluster: {
        type: Boolean,
        default: true
    },
    threshold: {// Cluster threshold in meters
        type: Number,
        default: 100
    }
})

$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
    collection = new Cesium.LabelCollection()
})


// 建筑变形/图元聚合
function calculateDistance(pos1, pos2) {
    return Cesium.Cartesian3.distance(pos1, pos2);
}
let clusters = [];
let clusterCache = []
let thresholdCache = []
let collectionCache = []
const addToCollectionWithCluster = (primitivePositions, primitiveTexts) => {
    primitivePositions.forEach((position) => {
        let addedToCluster = false;
        for (let cluster of clusters) {
            if (calculateDistance(cluster.position, position) < props.threshold) {
                cluster.positions.push(position);
                addedToCluster = true;
                break;
            }
        }
        if (!addedToCluster) {
            clusters.push({
                position: position,
                positions: [position]
            });
        }
    });
    clusters.forEach((cluster) => {
        const textByPosition = primitiveTexts[primitivePositions.indexOf(cluster.position)]
        if (cluster.positions.length > 1) {
            // 添加一个label代表
            const labelPresent = collection.add({
                position: cluster.position,
                text: textByPosition,  // The text to display 
                font: '14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,  // Outline width
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                // pixelOffset: new Cesium.Cartesian2(0, -50)
            });
            // Pre-render event to adjust label size based on camera distance
            _viewer_.scene.preRender.addEventListener(function () {
                const cameraPosition = _viewer_.camera.position;
                // Call the function to adjust label size
                adjustLabelSize(labelPresent, cameraPosition);
            });
        } else {
            addToCollection({
                position: cluster.position,
                text: textByPosition
            })
        }
    });
}
const cache = (threshold, clusters, collection) => {
    thresholdCache.push(threshold)
    clusterCache.push({
        threshold,
        clusters
    })
    collectionCache.push({
        threshold,
        collection
    })
}
const getClustersFromCacheByThreshold = (threshold) => {
    if (clusterCache.length) {
        let cache = clusterCache.find(item => item.threshold === threshold)
        if (cache && cache.clusters) console.log(cache.clusters, 'cacheclu')
        return cache ? cache.clusters : []
    } else
        return []
}

const getCollectionFromCacheByThreshold = (threshold) => {
    let last = collection
    if (collectionCache.length) {
        let cache = collectionCache.find(item => item.threshold === threshold)
        if (cache && cache.collection) console.log(cache.collection, 'cachecol')
        return cache ? cache.collection : new Cesium.LabelCollection()
    }
    return last
}
const addToCollection = (info) => {
    // Add a label to the collection
    const label = collection.add({
        position: info.position,
        text: info.text,  // The text to display
        font: '12px sans-serif', // Font size and type
        fillColor: Cesium.Color.WHITE,  // Text color
        outlineColor: Cesium.Color.BLACK,  // Outline color for better readability
        outlineWidth: 2,  // Outline width
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,  // Style to use both fill and outline
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,  // Anchor point at the bottom
        // pixelOffset: new Cesium.Cartesian2(0, -50)  // Offset to adjust position in screen space
    });
    // Pre-render event to adjust label size based on camera distance
    _viewer_.scene.preRender.addEventListener(function () {
        const cameraPosition = _viewer_.camera.position;
        // Call the function to adjust label size
        adjustLabelSize(label, cameraPosition);
    });
}

// Function to adjust label size based on camera distance
function adjustLabelSize(label, cameraPosition) {
    const labelPosition = label.position;
    const distance = Cesium.Cartesian3.distance(cameraPosition, labelPosition);
    // Calculate scale factor (adjust 10000 divisor as needed to fine-tune scaling)
    const scaleFactor = Math.max(0.5, 100000 / distance);
    // Update label's font size dynamically
    label.font = `${Math.min(16, scaleFactor * 3)}px sans-serif`;
}


const main = () => {
    if (!_viewer_ || props.threshold < 0) {
        collection.show = false
        return
    }
    let last = collection
    clusters = getClustersFromCacheByThreshold(props.threshold)
    last.show = false
    collection = getCollectionFromCacheByThreshold(props.threshold)
    collection.show = true
    _viewer_.render()
    if (props.options.length) {
        // console.log(props.options, 'options');
        if (props.cluster) {
            let posArr = [], textArr = []
            props.options.forEach(item => {
                posArr.push(item.position)
                textArr.push(item.text)
            })
            if (!thresholdCache.includes(props.threshold)) {// 没有缓存
                addToCollectionWithCluster(posArr, textArr)
                cache(props.threshold, clusters, collection)
            }
        }
        else {
            props.options.forEach(item => {
                addToCollection(item)
            })
        }
        // console.log(collection, 'collection')
        _viewer_.scene.primitives.add(collection);
    }
}


let timer
onMounted(() => {
    timer = setTimeout(() => {
        let timer2 = setInterval(() => {
            main()
            clearInterval(timer2)
        }, 1)
    }, 0)
})
watch(() => props, () => {
    main()
}, { deep: true })
onBeforeUnmount(() => {
    clearTimeout(timer)
})

defineExpose({
    getCollection: () => collection
})



</script>