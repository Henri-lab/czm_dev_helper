<template></template>
<script setup>
import { onBeforeUnmount } from 'vue';
import { onMounted } from 'vue';
import { inject } from 'vue';
import * as Cesium from 'cesium'
import { watch } from 'vue';

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
        type: Cesium.PrimitiveCollection,
        default: null
    },
    cluster: {
        type: Boolean,
        default: true
    },
    threshold: {// Cluster threshold in meters
        type: Number,
        default: 100
    },
    clear: {
        type: Boolean,
        default: false
    }
})

$bus.on('czmViewerEvent@henrifox', (viewer) => {
    _viewer_ = viewer
    collection = new Cesium.PrimitiveCollection()
})
// 图元聚合
// 遍历所有原始位置，检查是否可加入现有聚类。
// 若与某个聚类中心距离小于阈值，则加入该聚类；否则创建新聚类。

// Function to calculate the distance between two points
function calculateDistance(pos1, pos2) {
    return Cesium.Cartesian3.distance(pos1, pos2);
}
// List of clusters
let clusters = [];
let clusterCache = []
let thresholdCache = []
let collectionCache = []
const addToCollectionWithCluster = (primitivePositions) => {
    // Iterate over all primitives and cluster them
    primitivePositions.forEach((position) => {
        let addedToCluster = false;
        // Check existing clusters
        for (let cluster of clusters) {
            if (calculateDistance(cluster.position, position) < props.threshold) {
                cluster.positions.push(position);  // Add position to the existing cluster
                addedToCluster = true;
                break;
            }
        }
        // If no suitable cluster is found, create a new cluster
        if (!addedToCluster) {
            clusters.push({
                position: position,
                positions: [position]
            });
        }
    });
    // console.log(clusters, 'clusters----')
    // Render clustered primitives
    clusters.forEach((cluster) => {
        if (cluster.positions.length > 1) {
            // For clustered primitives, you could render a single larger sphere representing the cluster
            const geometry = new Cesium.SphereGeometry({
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                radius: 10 * cluster.positions.length // Larger radius for clusters
            });
            const geometryInstance = new Cesium.GeometryInstance({
                geometry: geometry,
                modelMatrix: Cesium.Matrix4.fromTranslation(cluster.position),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED.withAlpha(0.5))
                }
            });
            const primitive = new Cesium.Primitive({
                geometryInstances: geometryInstance,
                appearance: new Cesium.PerInstanceColorAppearance({
                    translucent: true,
                    closed: true
                })
            });
            collection.add(primitive);
        } else {
            // For single primitives, render a smaller sphere
            const geometry = new Cesium.SphereGeometry({
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                radius: 10  // Smaller radius for individual primitives
            });
            const geometryInstance = new Cesium.GeometryInstance({
                geometry: geometry,
                modelMatrix: Cesium.Matrix4.fromTranslation(cluster.position),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOW.withAlpha(0.5))
                }
            });
            const primitive = new Cesium.Primitive({
                geometryInstances: geometryInstance,
                appearance: new Cesium.PerInstanceColorAppearance({
                    translucent: true,
                    closed: true
                })
            });
            collection.add(primitive);
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
        return cache ? cache.collection : new Cesium.PrimitiveCollection()
    }
    return last
}
const addToCollection = (center, radius) => {
    const sphereGeometry = new Cesium.SphereGeometry({
        center: center,
        radius: radius,
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
    });
    const sphereInstance = new Cesium.GeometryInstance({
        geometry: sphereGeometry,
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(center),
            new Cesium.Cartesian3(0.0, 0.0, radius / 2.0),
            new Cesium.Matrix4()
        ),
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                Cesium.Color.RED.withAlpha(0.5)
            )
        }
    });
    const primitive = new Cesium.Primitive({
        geometryInstances: sphereInstance,
        appearance: new Cesium.PerInstanceColorAppearance({
            closed: true,
            translucent: true
        })
    });
    collection.add(primitive);
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
        if (props.cluster) {
            let posArr = []
            let radiusArr = []
            props.options.forEach(item => {
                posArr.push(item.center)
                radiusArr.push(item.radius)
            })
            let maxR = Math.max(...radiusArr)
            if (!thresholdCache.includes(props.threshold)) {// 没有缓存
                addToCollectionWithCluster(posArr)
                cache(props.threshold, clusters, collection)
                // console.log(collection, 'curCollection', collectionCache, 'cache')
            }
        }
        else {
            props.options.forEach(item => {
                addToCollection(item.center, item.radius)
            })
        }
        _viewer_.scene.primitives.add(collection);
    }
}





let timer
onMounted(() => {
    // console.log('sphere mounted')
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
    // console.log('sphere unmounted')
    clearTimeout(timer)
})

defineExpose({
    getCollection: () => collection
})





</script>