<!-- 给其他组件分发视图的管理者 -->
<template>
    <div id="czm-container" ref="_czm_">
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect, provide, onBeforeMount } from 'vue';
import { defineStore } from 'pinia'
import czmHelper from '../lib';
import mitt from 'mitt'
import * as Cesium from 'cesium';
const props = defineProps({
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '100%'
    },
    name: {//map name is not viewer name
        type: String,
        default: ''
    },
    option: {// map viewer config
        type: Object,
        default: () => ({})
    }
})

let useStore = defineStore('czmHelper', {
    state: () => {
        return {
            map: '', // name of map 
            mapInfo: {},
            viewer: null,
            editor: null,
            // 检测变化次数
            mapUpdatedCount: 0,
            viewerUpdatedCount: 0,
            editorUpdatedCount: 0,
        };
    },
    getters: {
        Map: state => state.map,
        MapInfo: state => state.mapInfo,
        Viewer: state => state.viewer,
        Editor: state => state.editor,
        MapUpdatedCount: state => state.mapUpdatedCount,
        ViewerUpdatedCount: state => state.viewerUpdatedCount,
        EditorUpdatedCount: state => state.editorUpdatedCount
    },
    actions: {
        setMap(type) {
            this.map = type;
            this.mapUpdatedCount++;
        },
        setViewer(viewer) {
            this.viewer = viewer;
            this.viewerUpdatedCount++;
        },
        setEditor(editor) {
            this.editor = editor;
            this.editorUpdatedd++;
        },
    }
});
let $store = useStore();
// 分发管理者
let cfgM, sM, cM, eM, dM, dP
let managerModule = czmHelper.ManagerModule;
cfgM = new managerModule.ConfigManager();
dP = new czmHelper.DataModule.DataPrepocesser()
function updateManager(viewer) {
    sM = new managerModule.SceneManager(viewer);
    cM = new managerModule.CameraManager(viewer);
    eM = new managerModule.EventManager(viewer);
    dM = new managerModule.DrawingManager(viewer);
}


const $viewer = computed(() => $store.Viewer);

const $bus = mitt()
const _czm_ = ref(null)


onMounted(() => {
    _czm_.value.style.width = props.width;
    _czm_.value.style.height = props.height;
})





let curName //当前地图类型
let curViewer;  //导出的地图
let cacheViewers = [];//导出的地图集

async function createMap(name) {
    name ? curName = name.toLowerCase() : curName = '';
    // 查找缓存
    const oldViewer = cacheViewers.find(cache => cache.name === name)
    if (oldViewer) {
        // console.log(_.isEqual(oldViewer, await toWuhan(el)),'bug')
        // return oldViewer.data;
    }
    // 缓存没有，则初始化
    if (props.option == {} || !name) {
        console.log('default viewer creating')
        curViewer = await toDefaultViewer()
        console.log('default viewer created')
        curName = 'global@henrifox'

    } else {
        console.log(`custom viewer-${name} creating`)
        curViewer = await toCustomViewer(props.option);
        console.log(`custom viewer-${name} created`)
        curName = name
    }
    $store.setMap(curName)//MapUpdatedCount ++
    return curViewer;
}


// -全局视图
const toDefaultViewer = async () => {
    // 世界地图
    const def_vcfg_global = {
        containerId: 'czm-container',
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
        const global = await cfgM.initViewer(def_vcfg_global);
        $store.setViewer(markRaw(global));
        updateManager(global);
        sM.initScene();
        cM.isRotationEnabled(1, 0, 0.5); // 开启地球自转
        switchViewerTo(global); // 切换地图
        return global;
    } catch (error) {
        console.error("Error initializing default viewer:", error);
    }
}
const toCustomViewer = async (option) => {
    try {
        // 世界地图配置...
        option.containerId = `czm-container`;
        const _viewer = await cfgM.value.initViewer(option);
        $store.setViewer(markRaw(_viewer));
        updateManager(_viewer);
        sM.initScene();
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


provide('$bus', $bus)
provide('$store', $store)
provide('$viewer', $viewer);
provide('SceneManager', sM);
provide('CameraManager', cM);
provide('EventManager', eM);
provide('DrawingManager', dM);
provide('DataProcesser', dP);
provide('ConfigManager', cfgM);


onMounted(async () => {
    console.log(import.meta.url, '<CzmMap> mounted')
    await createMap(props.name)
})
</script>

<style lang="scss" scoped>
.czm-helper {}
</style>
