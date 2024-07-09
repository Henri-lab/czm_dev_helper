
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

  /**
   * Initializes the scene with the given options.
   *
   * @param {Object} options - The options for initializing the scene.
   * @param {Object} options.sun - The configuration for the sun.
   * @param {boolean} options.sun.show - Whether to show the sun.
   * @param {Object} options.moon - The configuration for the moon.
   * @param {boolean} options.moon.show - Whether to show the moon.
   * @param {Object} options.globe - The configuration for the globe.
   * @param {boolean} options.globe.enableLighting - Whether to enable lighting on the globe.
   * @param {boolean} options.globe.depthTestAgainstTerrain - Whether to depth test against terrain.
   * @param {boolean} options.globe.showGroundAtmosphere - Whether to show ground atmosphere.
   * @param {Object} options.postProcessStages - The configuration for post-process stages.
   * @param {Object} options.postProcessStages.bloom - The configuration for the bloom effect.
   * @param {boolean} options.postProcessStages.bloom.enabled - Whether to enable the bloom effect.
   * @param {number} options.postProcessStages.bloom.contrast - The contrast of the bloom effect.
   * @param {number} options.postProcessStages.bloom.brightness - The brightness of the bloom effect.
   * @param {boolean} options.postProcessStages.bloom.glowOnly - Whether to apply the effect only to glowing areas.
   * @param {number} options.postProcessStages.bloom.delta - The delta value for the bloom effect.
   * @param {number} options.postProcessStages.bloom.sigma - The sigma value for the bloom effect.
   * @param {number} options.postProcessStages.bloom.stepSize - The step size for the bloom effect.
   * @param {boolean} options.postProcessStages.bloom.isSelected - Whether the bloom effect is selected.
   * @param {number} options.postProcessStages.bloom.selectedBloom - The selected bloom value.
   * @param {Cesium.Color} options.postProcessStages.bloom.bloomColor - The color of the bloom effect.
   * @param {Object} options.postProcessStages.brightness - The configuration for the brightness adjustment.
   * @param {boolean} options.postProcessStages.brightness.enabled - Whether to enable brightness adjustment.
   * @param {number} options.postProcessStages.brightness.brightness - The brightness value.
   * @param {Object} options.postProcessStages.fxaa - The configuration for the FXAA effect.
   * @param {boolean} options.postProcessStages.fxaa.enabled - Whether to enable the FXAA effect.
   * @param {Object} options.shadows - The configuration for shadows.
   * @param {boolean} options.shadows.enabled - Whether to enable shadows.
   * @param {number} options.shadows.darkness - The darkness of the shadows.
   * @param {boolean} options.undergroundMode - Whether to enable underground mode.
   * @param {Object} options.terrainProvider - The configuration for the terrain provider.
   * @param {boolean} options.terrainProvider.isCreateSkirt - Whether to create a skirt for the terrain provider.
   * @param {Object} options.fog - The configuration for the fog effect.
   * @param {boolean} options.fog.enabled - Whether to enable the fog effect.
   * @param {Object} options.creditContainer - The configuration for the credit container.
   * @param {string} options.creditContainer.display - The display property of the credit container.
   * @param {boolean} options.highDynamicRange - Whether to enable high dynamic range.
   *
   * @returns {undefined} This function does not return any value.
   */
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
    // __________________________________________________________________________
    // 👽(扩展)
    // 搜索资源并添加---和add3DModel具备类似功能,但不能批量处理 不能自动添加t_id 不能跳转到模型等
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
 * Function to add 3D model to the Cesium viewer.
 *
 * @param {string} type - The type of the 3D model. It can be '3dtiles', 'gltf', or 'primitive'.
 * @param {Object|Array} options - The options for loading the 3D model. If an array is provided, multiple models will be loaded.
 * @param {function} cb - The callback function to be executed after the model is loaded.
 * @param {Object} [extraOpt] - Additional options for the function.
 * @param {boolean} [extraOpt.isZoom] - If true, the viewer will zoom to the loaded model.
 *
 * @returns {Promise<Cesium.Cesium3DTileset|Cesium.Primitive|undefined>} - A promise that resolves to the loaded 3D model.
 * If the input is an array, it will return an array of loaded models.
 * If the input is not an array and the model fails to load, it will return undefined.
  */
  async add3DModel(type, options, cb, extraOpt = { isZoom: true }) {
    const that = this;
    const $dL = this.$dL;
    const _type = type.toLowerCase();
    let resArr = [];
    //  two type options
    if (Array.isArray(options)) {
      for (let option of options) {
        await loadAndAddModelByOption(option);
      }
    } else {//核心💫
      let _singleOpt = options
      const model = await loadAndAddModelByOption(_singleOpt);
      // here 跳转会因为异步问题 过快执行而拿不到 await loadAndAddModelByOption(_singleOpt)的结果 model
      // 不过为什么? 👺
      // 经过测试 这个跳转必须放在readyPromise中💥
      // if (extraOpt && extraOpt.isZoom) {
      //   // 跳转到模型
      //   that.viewer.zoomTo(model);
      // }
    }


    // Helper function to load and add a 3d model by a single option
    async function loadAndAddModelByOption(option) {
      try {
        let res;//加载的model
        if (_type === '3dtiles') {
          // $dL.load3DTiles会把加载的model 执行的progress 和err 通过option的三个on属性回调出来
          res = await $dL.load3DTiles(option);
        } else if (_type === 'gltf') {

          res = await $dL.loadGLTF(option);
        }

        if (res) {
          // 为啥加载gltf就挂起了?? -2024/7/8/23:00
          res.readyPromise.then((final) => {
            that.addToScene(final, _type);//核心
            resArr.push({ t_id: Date.now(), model: final });
            cb && cb(resArr);//传入回调cb 并标记一个timestamp 作为 t_id

            // 经过测试 这个跳转必须放在readyPromise中💥
            if (extraOpt && extraOpt.isZoom) {
              // 跳转到模型
              that.viewer.zoomTo(final);
            }

            // 想尝试在await loadAndAddModelByOption(_singleOpt)处拿到model 不过失败了 👺
            return final;
          }).catch(function (error) {
            console.error('Error loading model:', error);
          });
          // 在 Promise 中，通常使用 catch 方法来捕获异常，而 otherwise 方法不是标准的 Promise 方法。
          // 然而，有些库或框架可能定义了自己的 Promise 扩展方法，包括 otherwise 用于捕获错误。
          // 在 CesiumJS 中，它遵循标准的 Promise API，因此你应该使用 catch 方法来处理异步操作中可能出现的错误。
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


