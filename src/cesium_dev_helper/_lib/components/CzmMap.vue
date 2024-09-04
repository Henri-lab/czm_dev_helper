<!-- 创建ceisum地图视图 并且加载对应视图的管理者 -->
<template>
    <div id="czm-container">
        <div id="czm-viewer"></div>
    </div>
</template>

<script setup>
import { markRaw, onMounted, watchEffect, inject } from 'vue';
import useDefaultStore from '@/store';
import { initViewerAt, Editor } from '../index';
const props = defineProps({
    name: {
        type: String,
        default: 'global'
    },
    viewerconfig: {
        type: Object,
        default: () => ({})
    }

})
/** 
 * @description
 * 为cesium项目初始化viewer 并加载需要的数据
*/
import * as Cesium from 'cesium';
import _ from 'lodash';
const $store = inject('$store');
const cfgM = inject('ConfigManager')
const sM = inject('SceneManager')
const cM = inject('CameraManager');



let curTypeId = 'global' //当前地图类型
let curViewer = null;  //导出的地图
let cacheViewers = [];//导出的地图集


/**
 * Initializes a Cesium viewer at a specified element with a specific map type.
 *
 * @param {Object} [el={ id: 'viewer' }] - The HTML element where the viewer will be created.
 * @param {string} type - The type of map to be displayed. Can be either 'global' or 'wuhan-test' or else.
 * @returns {Promise<Cesium.Viewer>} - A promise that resolves to the initialized Cesium viewer.
 *
 * @example
 * // Initialize a viewer at the element with id 'cesiumContainer' and display the global map
 * const viewer = await initViewerAt({ id: 'cesiumContainer' }, 'global');
 *
 * // Initialize a viewer at the default element and display the wuhan-test map
 * const viewer = await initViewerAt({}, 'wuhan-test');
 */

async function createViewer(name) {
    curTypeId = name.toLowerCase();
    // 查找缓存
    const oldViewer = cacheViewers.find(cache => cache.name === name)
    if (oldViewer) {
        // console.log(_.isEqual(oldViewer, await toWuhan(el)),'bug')
        // return oldViewer.data;
    }
    // 缓存没有，则初始化
    // 切换地图资源
    if (props.viewerconfig == {}) {
        curViewer = await toGlobal()
    } else {
        props.viewerconfig.containerId = `czm_viewer`;
        curViewer = await to(props.viewerconfig);
    }
    return curViewer;
}

// 地图配置
// -全局视图
const toGlobal = async () => {
    // 世界地图
    const def_vcfg_global = {
        containerId: `czm_viewer`,
        baseConfig: {
            navigationHelpButton: true,
            navigationInstructionsInitiallyVisible: true,
        },
        providerConfig: {
            terrainProvider: [],
            imageryProvider: [],
        },
        extraConfig: {
            name: 'global',
            AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw',
            logo: false,
            depthTest: true,
        },
    };
    try {
        // 世界地图配置...
        const global = await cfgM.value.initViewer(def_vcfg_global);
        $store.setViewer(markRaw(global));
        sM.value.initScene();
        cM.value.isRotationEnabled(1, 0, 0.5); // 开启地球自转
        switchViewerTo(global); // 切换地图
        return global;
    } catch (error) {
        console.error("Error initializing global viewer:", error);
    }
}
const to = async (viewerConfig) => {
    try {
        // 世界地图配置...
        const _viewer = await cfgM.value.initViewer(viewerConfig);
        $store.setViewer(markRaw(_viewer));
        sM.value.initScene();
        switchViewerTo(_viewer); // 切换地图
        return _viewer;
    } catch (error) {
        console.error("Error initializing viewer:", error);
    }
}

// --辅助--
function switchViewerTo(viewer) {
    if (curViewer && curViewer !== viewer) {
        cacheViewers.push({//销毁 前 缓存
            name: curTypeId,
            data: viewer
        });
        destroyViewer(curViewer);
    }
    // 设置为导出的currentViewer
    curViewer = viewer;
}
function destroyViewer(viewer) {
    if (viewer) {
        // console.log('destroy', viewer.name)
        viewer.destroy();
        viewer = null;
    }
}



// 创建视图 type类型的地图 加载到el元素
const init = (name) => {
    createViewer(name).then((viewer) => {
        if (viewer) {
            $store.setMap(curTypeId)
        }
    });
};
// 画笔(挂载map时创建)
let $editor;

watch(() => $store.MapUpdatedCount,
    (n, o) => {
        if (n > o) {//更新地图次数增加，重新加载地图
            init($store.Map);
        }
    }
);
</script>