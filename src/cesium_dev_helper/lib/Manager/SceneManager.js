
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
  addToScene(loaded = {}, Type, collectionOrSource) {
    let viewer = this.viewer;
    let scene = viewer.scene;
    const type = Type.toLowerCase();
    if (type === '3dtiles' || type === 'gltf' || type === 'primitive') {
      if (collectionOrSource) { return collectionOrSource.add(loaded); }
      else { return scene.primitives.add(loaded); }
    }
    else
      if (collectionOrSource) { return collectionOrSource.entities.add(loaded); }
      else { return viewer.entities.add(loaded); }
  }

  /**
 * 根据指定类型和选项异步加载并添加模型到场景中
 * @param {string} type - 模型类型，例如 '3dtiles' 或 'gltf'
 * @param {Object} option - 加载模型所需的配置选项
 * @param {Function} [cb] - 回调函数，用于处理加载结果
 * @param {Object} [extraOpt] - 额外选项，如是否自动缩放至模型
 * @param {Array} [arr=[]] - 可选参数，用于存储加载结果的数组
 */
  // 可以直接拿到model 也可以利用回调函数拿到model和其他附属信息
  async _addModelByOption(type, option, extraOpt, cb, arr) {
    const that = this;
    const $dL = that.$dL;
    let res = arr || [];
    function afterLoaded(loaded, type) {
      that.addToScene(loaded, type, extraOpt.layer);
      res.push({ created_time: Date.now(), model: loaded });//添加model的附属信息
      cb && cb(res);
      if (extraOpt && extraOpt.isZoom) {
        that.viewer.zoomTo(loaded);  // 跳转到模型
      }
      return loaded;
    }
    try {
      let model;
      if (type === 'gltf') {
        model = await $dL.loadGLTF(option);
        console.log(model, 'gltf')
        afterLoaded(model, type)
      }
      else if (type === '3dtiles') {
        model = await $dL.load3DTiles(option); // $dL.load3DTiles会把加载的model 执行的progress 和err 通过option的三个on属性回调出来
        model.readyPromise
          .then((final) => {
            afterLoaded(final, type)
          })
          .catch((error) => {
            console.error('Error loading model:', error);
          });
      }
    } catch (e) {
      console.error('Scene manager failed loading model', e);
      throw new Error(e);
    }
  };
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
  async add3DModel(type, options, extraOpt = { isZoom: true }, cb, arr) {
    const that = this;
    type = type.toLowerCase();
    //  two type options
    if (Array.isArray(options)) {
      for (let item of options) await that._addModelByOption(type, item, extraOpt, cb, arr)
    }
    else await that._addModelByOption(type, options, extraOpt, cb, arr);
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


