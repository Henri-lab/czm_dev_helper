
import Manager from "./Manager";

import { TencentImageryProvider } from "../Map/mapPlugin";
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


  async add3DTiles(options, cb) {
    let res = [];
    // options 可以是数组也可以是一个普通对象
    if (Array.isArray(options)) {
      await $dL.load3DTiles(options);
      options.forEach(opt => {
        // 加载成功
        opt.onSuccess(tile => {
          if (tile) {
            // 渲染
            this.viewer.scene.primitives.add(tile);
          }
          // 返回加载进度条
          opt.onProgress(progress => {
            res.push({
              loadTime: Date.now(),
              tile,
              progress,
            })
            // 暴露加载对象和相应的进度条
            cb(res)
          });
        })
        opt.onError(e => {
          if (e) {
            console.error(e, 'scene manager fail loading 3d tile ')
          }
        })
      })
    } else {
      let _option = options
      const tile = await this.load3DTiles(_option);
      this.viewer.scene.primitives.add(tile);
      _option.onSuccess(tile);
      // 统一用数组回调
      cb([{
        loadTime: Date.now(),
        tile,
        progress: 100,
      }]);
      opt.onError(e => {
        if (e) {
          console.error(e, 'scene manager fail loading 3d tile ')
        }
      })
    }
  };



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


