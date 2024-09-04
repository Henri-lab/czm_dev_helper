<!-- 创建ceisum地图视图 并且加载对应视图的管理者 -->
<template>
    <div id="czm-container">
        <div id="czm-viewer"></div>
    </div>
</template>

<script setup>
import { markRaw, onMounted, watchEffect, inject } from 'vue';
import * as Cesium from 'cesium';
import _ from 'lodash';
const props = defineProps({
    name: {//map name is not viewer name
        type: String,
        default: 'global'
    },
    option: {// map viewer config
        type: Object,
        default: () => ({})
    }

})
const $store = inject('$store');
const cfgM = inject('ConfigManager')
const sM = inject('SceneManager')
const cM = inject('CameraManager');


let curName = 'global' //当前地图类型
let curViewer = null;  //导出的地图
let cacheViewers = [];//导出的地图集

async function createMap(name) {
    curName = name.toLowerCase();
    // 查找缓存
    const oldViewer = cacheViewers.find(cache => cache.name === name)
    if (oldViewer) {
        // console.log(_.isEqual(oldViewer, await toWuhan(el)),'bug')
        // return oldViewer.data;
    }
    // 缓存没有，则初始化
    // 切换地图资源
    if (props.option == {}) {
        curViewer = await toGlobalViewer()
        curName = 'global'
    } else {
        props.option.containerId = `czm_viewer`;
        curViewer = await toCustomViewer(props.option);
        curName = name
    }
    $store.setMap(curName)
    return curViewer;
}

// 地图配置
// -全局视图
const toGlobalViewer = async () => {
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
        // 等待 Vue 完成响应式更新
        await nextTick();
        sM.value.initScene();
        cM.value.isRotationEnabled(1, 0, 0.5); // 开启地球自转
        switchViewerTo(global); // 切换地图
        return global;
    } catch (error) {
        console.error("Error initializing global viewer:", error);
    }
}
const toCustomViewer = async (option) => {
    try {
        // 世界地图配置...
        const _viewer = await cfgM.value.initViewer(option);
        $store.setViewer(markRaw(_viewer));
        await nextTick();
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
            name: curName,
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

watch(() => $store.MapUpdatedCount,
    (n, o) => {
        if (n > o) {//更新地图次数增加，重新加载地图
            createMap($store.Map);
        }
    }
);
</script>