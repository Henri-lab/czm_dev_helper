
import Manager from "./Manager";
import * as Cesium from "cesium";

import { defaultStyle, defaultShader } from "../Effect/tileStyle/default";
import { DataLoader } from "../Data";
// let Cesium = new Manager().Cesium;

export default class SceneManager extends Manager {
  constructor(viewer) {
    super(viewer);
    this.$dL = new DataLoader(viewer);
  }


  initScene = (options) => {
    let viewer = this.viewer;

    // 设置默认值
    const defaultOptions = {
      sun: {
        show: false
      },
      moon: {
        show: false
      },
      globe: {
        enableLighting: true,
        depthTestAgainstTerrain: true,
        showGroundAtmosphere: false
      },
      postProcessStages: {
        bloom: {
          enabled: true,
          contrast: 255,
          brightness: 0.02,
          glowOnly: false,
          delta: 3.1,
          sigma: 5,
          stepSize: 0.6,
          isSelected: false,
          selectedBloom: 10,
          bloomColor: Cesium.Color.fromCssColorString("#fafafa")
        },
        brightness: {
          enabled: true,
          brightness: 1.2
        },
        fxaa: {
          enabled: true
        }
      },
      shadows: {
        enabled: false,
        darkness: 0.8
      },
      undergroundMode: false,
      terrainProvider: {
        isCreateSkirt: false
      },
      fog: {
        enabled: false
      },
      creditContainer: {
        display: "none"
      },
      highDynamicRange: true
    };

    // 合并默认配置和传入的配置
    const config = { ...defaultOptions, ...options };

    // 设置场景属性
    viewer.scene.sun.show = config.sun.show;
    viewer.scene.moon.show = config.moon.show;
    viewer.scene.globe.enableLighting = config.globe.enableLighting;
    viewer.scene.globe.depthTestAgainstTerrain = config.globe.depthTestAgainstTerrain;
    viewer.scene.globe.showGroundAtmosphere = config.globe.showGroundAtmosphere;

    // 设置泛光效果
    const bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = config.postProcessStages.bloom.enabled;
    bloom.uniforms.contrast = config.postProcessStages.bloom.contrast;
    bloom.uniforms.brightness = config.postProcessStages.bloom.brightness;
    bloom.uniforms.glowOnly = config.postProcessStages.bloom.glowOnly;
    bloom.uniforms.delta = config.postProcessStages.bloom.delta;
    bloom.uniforms.sigma = config.postProcessStages.bloom.sigma;
    bloom.uniforms.stepSize = config.postProcessStages.bloom.stepSize;
    bloom.uniforms.isSelected = config.postProcessStages.bloom.isSelected;
    bloom.uniforms.selectedBloom = config.postProcessStages.bloom.selectedBloom;
    bloom.uniforms.bloomColor = config.postProcessStages.bloom.bloomColor;

    // 设置亮度调整
    var stages = viewer.scene.postProcessStages;
    viewer.postProcessStages.fxaa.enabled = config.postProcessStages.fxaa.enabled;
    viewer.scene.brightness = viewer.scene.brightness || stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
    viewer.scene.brightness.enabled = config.postProcessStages.brightness.enabled;
    viewer.scene.brightness.uniforms.brightness = config.postProcessStages.brightness.brightness;

    // 设置阴影
    viewer.shadows = config.shadows.enabled;
    viewer.shadowMap.darkness = config.shadows.darkness;

    // 设置地形轮廓
    viewer.scene.terrainProvider.isCreateSkirt = config.terrainProvider.isCreateSkirt;

    // 设置地下模式
    viewer.scene.undergroundMode = config.undergroundMode;

    // 设置雾效
    viewer.scene.fog.enabled = config.fog.enabled;

    // 设置高动态范围
    viewer.scene.highDynamicRange = config.highDynamicRange;

    // 隐藏水印
    viewer._cesiumWidget._creditContainer.style.display = config.creditContainer.display;
  };

  
  /**
   * Function to add a data source or 3D tileset to the Cesium viewer.
   *
   * @param {Cesium.Viewer} viewer - The Cesium viewer object to add the data source or 3D tileset to.
   * @param {Cesium.DataSource|Cesium.Cesium3DTileset} dataSourceOrTileset - The data source or 3D tileset to be added.
   * @param {string} type - The type of the data source or 3D tileset. It can be either '3dtiles' or 'gltf'.
   *
   * @returns {undefined} This function does not return any value.
   */
  async addToScene(loaded = {}, Type) {
    let viewer = this.viewer;
    let scene = viewer.scene;
    const type = Type.toLowerCase();
    // 直接添加(核心)
    if (type === '3dtiles' || type === 'gltf' || type === 'primitive') {
      return scene.primitives.add(loaded);
    } else if (!type.includes('url')) {
      return viewer.dataSources.add(loaded);
    }

    // 👽(扩展)
    // 搜索资源并添加---和add3DModel具备类似功能,但不能批量处理 不能自动添加t_id
    if (type === '3dtilesurl' || type === 'gltfurl') {
      const options = loaded

      const res = (type === '3dtilesurl') ?
        await this.$dL.load3DTiles(options)
        : await this.$dL.loadGLTF(options);

      res.readyPromise.then((primitive) => {
        return scene.primitives.add(primitive)
      })
    }

  }

  /**
   * Function to add 3D tiles to the Cesium viewer.
   *
   * @param {Object|Array} options - The options for loading 3D tiles. It can be a single object or an array of objects.
   * @param {Function} cb - The callback function to handle the loading progress and result with timestamp.
   *
   * @returns {undefined} This function does not return any value.
   */
  async add3DModel(options, type, cb) {
    const that = this;
    const $dL = this.$dL;
    const _type = type.toLowerCase();
    let resArr = [];
    //  two type options
    if (Array.isArray(options)) {
      for (let option of options) {
        await loadAndAddModelByOption(option);
      }
    } else {
      let _singleOpt = options
      await loadAndAddModelByOption(_singleOpt);
    }


    // Helper function to load and add a 3d model by a single option
    async function loadAndAddModelByOption(option) {
      try {
        let model;//加载后的model
        if (_type === '3dtiles') {
          // $dL.load3DTiles会把加载的model 执行的progress 和err 通过option的三个on属性回调出来
          model = await $dL.load3DTiles(option);
        } else if (_type === 'gltf') {
          model = await $dL.loadGLTF(option);
        }

        if (model) {
          model.readyPromise.then(() => {
            that.addToScene(model, _type);//核心
            resArr.push({ t_id: Date.now(), model });
            cb(resArr);//传入回调cb 并标记一个timestamp 作为 t_id
          });
        }

      } catch (e) {
        console.error('Scene manager failed loading model', e);
        throw new Error(e);
      }
    };
  }


  /**
   * Function to apply a default effect to a 3D tileset.
   *
   * @param {Cesium.Cesium3DTileset} tile - The 3D tileset to apply the effect to.
   *
   * @returns {undefined} This function does not return any value.
   */
  handleDefaultModelEffect = (tile) => {
    // Apply color-based styling to the 3D tileset
    tile.style = defaultStyle
    tile.customShader = defaultShader;
  };
}


