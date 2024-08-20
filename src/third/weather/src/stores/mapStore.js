
import { defineStore } from 'pinia'

import { ref } from 'vue'

export const useMapStore = defineStore('MapStore', () => {
    // Data-----------------------------
    // --zoom (default:5)
    // --longitude(default:116.404)
    // --latitude(default:39.915)
    // --defaultCity(default:'天安门')
    const defaultLon = 105.00
    const defaultLat = 35.00
    const defaultCity = '中国'
    const longtitude = ref(defaultLon)
    const latitude = ref(defaultLat)
    const zoom = ref(4)
    const currentZoom = ref(4)
    const minZoom = ref(3)
    const animateZoom = ref(15)
    const animateDuration = ref(2000)


    // --openLayer objects options
    const gdXYZ_url = ref('http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}')
    const gdXYZ_wrapX = ref(false)
    const gdTile_title = ref('basic')

    // 组件交流
    let islayerNextLevelLoaded = false

    // Func----------------------------


    // 是否已经定位
    const isPosition = () => {
        return !(longtitude.value === defaultLon && latitude.value === defaultLat)
    }
    // 获取阿里云的图层数据
    const getUrlAliyun = (adcode) => {
        return `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode}_full`
    }
    let index = 0
    const getLayerWithPolygonByAdcodeByAliyun = async (title, adcode /**{ wrapX, opacity, visible, zIndex, style }**/) => {
        return new ol.layer.Vector({
            title: title || `borderLayer-${index++}`,
            source: await new ol.source.Vector({
                title: `borderSource-${index++}`,
                url: getUrlAliyun(adcode),
                format: new ol.format.GeoJSON(),
                // wrapX: wrapX || false,
                // opacity: opacity,
                // visible: visible || true,
                // zIndex: zIndex || 0,
                // style: style || {}
            }),
        })
    }

    // 根据adcode添加aliyun的矢量图层，并设置图层title和name
    async function loadLayerWithPolygonByAdcodeByAliyun($map, adcode, layerTitle, layerName) {
        if (typeof adcode !== 'number' || typeof layerTitle !== 'string' || typeof layerName !== 'string')
            return null
        const layer = await getLayerWithPolygonByAdcodeByAliyun(layerTitle, adcode)
        layer.set('name', layerName) //📌
        $map.addLayer(layer)
    }
    // 根据图层name清除指定地图的图层
    function clearLayersByName($map, layerName) {
        $map.getLayers().getArray().forEach((layer) => {
           
                if (layer.get('name') === layerName) {
                    $map.removeLayer(layer)
                }
            
        })
    }
    // 添加图层,并保持此名称图层只有一个
    async function loadUniqueLayerWithPolygonByAdcodeByAliyun($map, adcode, layerTitle, layerNameUnique) {
        clearLayersByName($map, layerNameUnique)
        loadLayerWithPolygonByAdcodeByAliyun($map, adcode, layerTitle, layerNameUnique)

    }



    // 卸载事件
    function unEvent($map, pointermoveEventName, clickEventName) {
        if (pointermoveEventName.length) {
            pointermoveEventName.forEach((name) => {
                $map.un('pointermove', name)
            })
        } else if (pointermoveEventName == []) console.error('PointermoveEventName is empty')
        else $map.un('pointermove', pointermoveEventName)
        if (clickEventName.length) {
            clickEventName.forEach((name) => {
                $map.un('click', name)
            })
        } else if (clickEventName == []) console.error('clickmoveEventName is empty')
        else $map.un('click', clickEventName)
    }








    return {
        animateDuration,
        defaultLon,
        defaultLat,
        gdXYZ_url,
        gdXYZ_wrapX,
        gdTile_title,
        defaultCity,
        zoom,
        minZoom,
        animateZoom,
        currentZoom,
        longtitude,
        latitude,
        islayerNextLevelLoaded,
        isPosition,
        getUrlAliyun,
        getLayerWithPolygonByAdcodeByAliyun,
        loadLayerWithPolygonByAdcodeByAliyun,
        loadUniqueLayerWithPolygonByAdcodeByAliyun,
        unEvent
    }
    // test fail-------------------------------------------------------------------------
    // let $map = null
    // function getMap() {
    //     if ($map)
    //         return $map;
    // }


})