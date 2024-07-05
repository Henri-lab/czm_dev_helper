
import Manager from "./Manager";

import { TencentImageryProvider } from "../Plugin/mapPlugin";
import { DataLoader } from "../Data";
let Cesium = new Manager().Cesium;

export default class SceneManager extends Manager {
  constructor(viewer) {
    super(viewer);
    this.$dL = new DataLoader(viewer);
  }

  /**
   * Function to set the scene properties of the Cesium viewer.
   *
   * @param {Cesium.Viewer} viewer - The Cesium viewer object to control the scene.
   *
   * @returns {undefined} This function does not return any value.
   */
  initScene = () => {
    let viewer = this.viewer;
    // 隐藏太阳
    viewer.scene.sun.show = false;

    // 隐藏月亮
    viewer.scene.moon.show = false;

    // 开启全球光照
    viewer.scene.globe.enableLighting = true;

    // 关闭泛光
    const bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = false;

    // 亮度设置
    var stages = viewer.scene.postProcessStages;
    viewer.postProcessStages.fxaa.enabled = true;

    // 亮度调整
    viewer.scene.brightness =
      viewer.scene.brightness ||
      stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
    viewer.scene.brightness.enabled = true;
    viewer.scene.brightness.uniforms.brightness = 1.2;

    // 地形深度测试
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // 隐藏水印
    viewer._cesiumWidget._creditContainer.style.display = "none";

    // 关闭阴影
    viewer.shadows = false;

    // 阴影透明度
    viewer.shadowMap.darkness = 0.8;

    // 隐藏水印
    viewer.cesiumWidget.creditContainer.style.display = "none";

    // 高动态范围
    viewer.scene.highDynamicRange = true;

    // 泛光
    viewer.scene.postProcessStages.bloom.enabled = true;
    viewer.scene.postProcessStages.bloom.uniforms.contrast = 255;
    viewer.scene.postProcessStages.bloom.uniforms.brightness = 0.02;
    viewer.scene.postProcessStages.bloom.uniforms.glowOnly = false;
    viewer.scene.postProcessStages.bloom.uniforms.delta = 3.1;
    viewer.scene.postProcessStages.bloom.uniforms.sigma = 5;
    viewer.scene.postProcessStages.bloom.uniforms.stepSize = 0.6;
    viewer.scene.postProcessStages.bloom.uniforms.isSelected = false;
    viewer.scene.postProcessStages.bloom.uniforms.selectedBloom = 10;
    viewer.scene.postProcessStages.bloom.uniforms.bloomColor =
      Cesium.Color.fromCssColorString("#fafafa");

    // 隐藏太阳和月亮
    viewer.scene.sun.show = false;
    viewer.scene.moon.show = false;

    // 关闭地下模式
    viewer.scene.undergroundMode = false;

    // 关闭地形轮廓
    viewer.scene.terrainProvider.isCreateSkirt = false;

    // 关闭地球大气
    viewer.scene.globe.showGroundAtmosphere = false;

    // 关闭全局光照
    viewer.scene.globe.enableLighting = false;

    // 关闭雾效
    viewer.scene.fog.enabled = false;
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
    tile.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ["Number(${Elevation})<20", "color('rgb(25, 211, 226)',0.0)"],
          ["Number(${Elevation})>20", "color('rgb(25, 211, 226)',1)"],
          //['true', "color('rgb(42, 122, 237)',1)"]
        ],
        show: false,
      },
    });

    // Apply a custom shader to the 3D tileset for more advanced effects
    const customShader = new Cesium.CustomShader({
      uniforms: {
        maxHeight: {
          type: Cesium.UniformType.FLOAT,
          value: 660.0,
        },
        minHeight: {
          type: Cesium.UniformType.FLOAT,
          value: 520.0,
        },
      },
      mode: Cesium.CustomShaderMode.MODIFY_MATERIAL,
      lightingModel: Cesium.LightingModel.PBR,
      vertexShaderText: /*glsl*/ `
            void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {

            }
       `,
      fragmentShaderText: /*glsl*/ `
            void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
                vec3 positionMC = fsInput.attributes.positionMC;
            
                // Note: Float values in shader should be written with decimal point, otherwise it will throw an error. For example, 0 should be written as 0.0, 1 as 1.0.
                float _baseHeight = minHeight; // The base height of the building, needs to be adjusted to a suitable value.
                float _heightRange = maxHeight; // The range for highlighting (_baseHeight ~ _baseHeight + _heightRange)
                float _glowRange = maxHeight; // The range for the glowing effect (height)
                // Base color of the building
                float czm_height = positionMC.y - _baseHeight -65.0;
                float baseColor = czm_height / _heightRange;
                float bottomColor= czm_height / _heightRange*2.0;
                // Give the roof a fixed color to add volume
                if(czm_height<29.0) {
                    material.diffuse *= vec3(bottomColor);
                }else{
                  material.diffuse *= vec3(baseColor); // Gradient
                }
            }
         `,
    });
    tile.customShader = customShader;
  };

}


