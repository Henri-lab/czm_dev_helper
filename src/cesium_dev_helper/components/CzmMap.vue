<!-- 给其他组件分发视图的管理者 -->
<template>
    <div id="czm-container@henrifox" class="czm-container@henrifox" ref="__CzmMap__" style="position: relative;">
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect, provide, onBeforeMount } from 'vue';
import { defineStore } from 'pinia'
import czmHelper from '../lib';
import mitt from 'mitt'
import * as Cesium from 'cesium';
import { getGlOfViewer } from '../lib/util/versionOf';
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
            // 
            manager: {
                SceneManager: null,
                CameraManager: null,
                EventManager: null,
                DrawingManager: null,
                DataProcesser: null,
                ConfigManager: null
            }
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
let $bus = mitt()
let $store = useStore();
let $viewer
// 分发管理者
let cfgM, dP;
let sM, cM, eM, dM, lM, editor, effecter;
let managerModule = czmHelper.ManagerModule;
let editorModule = czmHelper.EditorModule;
let effectModule = czmHelper.EffectModule;
cfgM = new managerModule.ConfigManager();
dP = new czmHelper.DataModule.DataPrepocesser()
function _updateViewerManager_(viewer) {
    cM = new managerModule.CameraManager(viewer);
    sM = new managerModule.SceneManager(viewer);
    eM = new managerModule.EventManager(viewer);
    dM = new managerModule.DrawingManager(viewer);
    lM = new managerModule.LayerManager(viewer)
    effecter = new effectModule.EffectController(viewer)
    editor = new editorModule.Editor(viewer)
}

const __CzmMap__ = ref(null)
onMounted(() => {
    __CzmMap__.value.style.width = props.width;
    __CzmMap__.value.style.height = props.height;
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
        console.log('default viewer creaitng')
        curViewer = await _toDefaultViewer_()
        // curViewer.scene.highDynamicRange = false;
        curName = 'global@henrifox'
        console.log('default viewer created', curViewer)

    } else {
        console.log(`custom viewer-${name} creating`)
        curViewer = await _toCustomViewer_(props.option);
        curName = name
        console.log(`custom viewer-${name} created`, curViewer)
        getGlOfViewer(curViewer)
    }
    $store.setMap(curName)//MapUpdatedCount ++
    return curViewer;
}

const _toDefaultViewer_ = async () => {
    // 世界地图
    const def_vcfg_global = {
        containerId: 'czm-container@henrifox',
        baseConfig: {
            contextOptions: {
                requestWebgl2: true,
            },
            useDefaultRenderLoop: true
        },
        providerConfig: {
            terrainProvider: [],
            imageryProvider: [],
        },
        extraConfig: {
            name: 'global@henrifox',
            AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw',
            logo: false,
            depthTest: true,
        },
    };
    try {
        // 世界地图配置...
        const global = await cfgM.initViewer(def_vcfg_global);
        $store.setViewer(markRaw(global));
        _updateViewerManager_(global);
        sM.initScene();
        // cM.isRotationEnabled(1, 0, 0.5); // 开启地球自转
        _switchViewerTo_(global); // 切换地图
        return global;
    } catch (error) {
        console.error("Error initializing default viewer:", error);
    }
}
const _toCustomViewer_ = async (option) => {
    try {
        // 世界地图配置...
        option.containerId = `czm-container@henrifox`;
        const _viewer = await cfgM.initViewer(option);
        $store.setViewer(markRaw(_viewer));
        _updateViewerManager_(_viewer);
        sM.initScene();
        _switchViewerTo_(_viewer); // 切换地图
        return _viewer;
    } catch (error) {
        console.error("Error initializing viewer:", error);
    }
}
function _switchViewerTo_(viewer) {
    if (curViewer && curViewer !== viewer) {//新 viewer 加入
        cacheViewers.push({//销毁 前 缓存
            name: curName,
            data: viewer
        });
        _destroyViewer_(curViewer);
    }
    curViewer = viewer;
}
function _destroyViewer_(viewer) {
    if (viewer) {
        viewer.destroy();
        viewer = null;
    }
}


provide('$bus', $bus)
provide('$store', $store)

onMounted(async () => {
    console.log(import.meta.url, '<CzmMap> mounted')
    await createMap(props.name)
    $bus.emit('czmViewerEvent@henrifox', curViewer)
    $bus.emit('czmCameraEvent@henrifox', cM)
    $bus.emit('czmEditorEvent@henrifox', editor)
    $bus.emit('czmEffectEvent@henrifox', { dP, sM, cM, eM, effecter, editor })
    $bus.emit('czmLayerEvent@henrifox', { viewer: curViewer, editor, eM, lM, cM })
})
</script>
