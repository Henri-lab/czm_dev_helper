const providerKeys = ['ImageryProvider', 'TerrainProvider'];//限制的Provider类型

const defaultToken = import.meta.env.VITE_CESIUM_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw';

let Cesium = null;


export default class ConfigManager {
    /**
     * 初始化 ConfigManager 类
     * @param {Object} cesiumGlobal - Cesium 全局对象
     * @example 
     *创建 Cesium Viewer 的控制器实例
     *const cesiumGlobal = Cesium; // 确保 Cesium 已经在你的项目中正确导入
     *const viewerController = new ConfigManager(cesiumGlobal);

     * 初始化 Viewer
     *const viewer = viewerController.init({
     *containerId: 'cesiumContainer',
     *viewerConfig: {},
     *extraConfig: { depthTest: true, logo: false },
     *MapImageryList: [],
     *imageryProvider: {}
     *});
    */
    constructor(cesiumGlobal) {
        Cesium = cesiumGlobal;
        this.init_data();
    }

    /**
     * 初始化数据
     */
    init_data() {
        this.viewer = null;
    }

    /**
     * 初始化 Viewer
     * @param {Object} config - 配置对象
     * @param {string} config.containerId - 容器ID
     * @param {Object} config.viewerConfig - Viewer 配置
     * @param {{AccessToken:string,logo:boolean,depthTest:boolean}} config.extraConfig - 额外配置 
     * @param {Array<{type:string,option:Object}>} config.MapImageryList - 影像图层列表 
     * @param {{ImageProvider:{type:string,option:Object}}} config.imageryProviderOpt - 影像提供者配置 
     * @returns {Cesium.Viewer} - 返回初始化后的 Viewer 对象
     */
    init({ containerId, viewerConfig, extraConfig, MapImageryList, imageryProviderOpt }) {
        const mapID = containerId;

        // viewer配置
        let vConfig = /**@default*/{
            contextOptions: {
                webgl: {
                    alpha: false
                }
            },
            animation: false,
            timeline: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            selectionIndicator: false,
            shadow: true,
            sceneMode: Cesium.SceneMode.SCENE3D,
            infoBox: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            projectionPicker: false,
            baseLayerPicker: false,
            shouldAnimate: true,
            navigation: false,
            showRenderLoopErrors: true
        };

        let providerConf = this.findCesiumProvider(imageryProviderOpt);
        vConfig = Object.assign(vConfig, viewerConfig);

        Cesium.Ion.defaultAccessToken = extraConfig['AccessToken'] || defaultToken;
        const viewer = new Cesium.Viewer(mapID, { ...vConfig, ...providerConf });

        if (!extraConfig['logo']) {
            const cC = viewer.cesiumWidget.creditContainer;
            cC.style.display = 'none';
        }

        if (extraConfig['depthTest']) {
            viewer.scene.globe.depthTestAgainstTerrain = true;
        }

        if (MapImageryList && MapImageryList.length > 0) {
            MapImageryList.forEach(imagery => {
                this.addImageryProvider(viewer, imagery.type, imagery.option);
            });
        }

        this.viewer = viewer;
        return viewer;
    }

    /**
     * 添加影像提供者
     * @param {Object} viewer - Viewer 实例
     * @param {string} type - 提供者类型
     * @param {Object} option - 提供者选项
     */
    addImageryProvider(viewer, type, option) {
        viewer.imageryLayers.addImageryProvider(
            this.createCesiumProvider({ type, option })
        );
    }

    /**
     * 获取 Cesium 提供者配置
     * @param {Object} options - 提供者配置选项
     * @returns {Object} - 返回配置对象
     */
    findCesiumProvider(options) {
        const object = {};
        for (const key in options) {
            if (providerKeys.includes(key) && options[key]/*config*/ && options[key].type) {
                object[key] = this.createCesiumProvider(options[key]);
            } else {
                object[key] = options[key];
            }
        }
        return object;
    }

    /**
     * 创建 Cesium 提供者实例
     * @param {Object} config - 提供者配置
     * @param {string} config.type - 提供者类型
     * @param {Object} config.option - 提供者选项
     * @returns {Object} - 返回提供者实例
     */
    createCesiumProvider(config) {
        const ProviderClass = Cesium[config.type];
        return new ProviderClass(config.option);
    }
}




