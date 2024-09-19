import { render } from "vue";
import { isValidProvider, isValidTerrianProviderType, isValidImageryProviderType, isValidViewerProperty } from "../util/isValid";
import { parse_viewerConfig } from "../util/parse";
import Manager from "./Manager";
import * as Cesium from "cesium";

// let Cesium = new Manager().Cesium;
// 必备 
window.CESIUM_BASE_URL = 'node_modules/cesium/Build/CesiumUnminified';


/**
 * 管理生成cesium viewer的配置文件 并可以初始化viewer
 */
export default class ConfigManager extends Manager {
    /**
     * 初始化 ConfigManager 类
     * @param {Object} cesiumGlobal - Cesium 全局对象
    */
    constructor() {
        super();
        this.init_data();
    }

    /**
     * 初始化数据
     */
    init_data() { this.data = {} }

    /**
     * 初始化 Viewer
     * @param {Object} config - 配置对象
     * @param {string} config.containerId - 容器ID
     * @param {Object} config.baseConfig - Viewer 基础配置
     * @param {Object} config.providerConfig - 影像地形配置列表 
     * @param {{AccessToken,logo,depthTest,canvas}} config.extraConfig - 额外配置 
     * @returns {Cesium.Viewer} - 返回初始化后的 Viewer 对象
     */

    async initViewer(config, all = false) {
        console.log(config, 'config')
        const _config = parse_viewerConfig(config);
        console.log(_config, 'parsed config')
        // 核心

        let viewer = new Cesium.Viewer(_config.id, _config.parsed);

        // 加载影像图层列表 -通过 viewer.imageryLayers.addImageryProvider方法
        _config.images && _config.images.forEach(image => viewer.imageryLayers.addImageryProvider(image));
        
        // 设置viewer的其他属性
        const extra = _config.extra;
        if (extra['name']) {
            viewer.name = extra['name'];
        }


        if (!extra['logo']) {
            const cC = viewer.cesiumWidget.creditContainer;
            cC.style.display = 'none';
        }

        if (extra['depthTest']) {
            viewer.scene.globe.depthTestAgainstTerrain = true;
        }

        if (extra['canvas']) {
            // 访问 cesium-widget canvas 元素
            let canvas = viewer.scene.canvas;

            // 设置 cesium-widget canvas 的宽度和高度
            canvas.style.width = extra['canvas'].width + 'px';
            canvas.style.height = extra['canvas'].height + 'px';

            viewer.resize();
        }
        this.viewer = viewer;
        // console.log(viewer, ' created Viewer')
        if (all) {
            const scene = viewer.scene;
            const renderer = viewer.renderer;
            const camera = viewer.camera;
            return {
                viewer,
                scene,
                renderer,
                camera
            }
        }
        else return viewer;
    }
}



