
import * as Cesium from "cesium";
import { TencentImageryProvider } from "../Map/mapPlugin";

/**
 * Initializes a Cesium viewer with specified options and adds a Tencent imagery layer.
 *
 * @param {HTMLElement} container - The HTML element where the viewer will be rendered.
 *
 * @returns {Cesium.Viewer} - The initialized Cesium viewer object.
 */
export const initViewer = (container) => {
  // Initialize Cesium viewer object with specified options
  const viewer = new Cesium.Viewer(container, {
    timeline: false, // Hide timeline control
    animation: false, // Hide animation control
    baseLayerPicker: false, // Avoid token issue
    infoBox: false, // Hide info box after clicking on elements
    selectionIndicator: false, // Hide selection indicator, default is true
    skyAtmosphere: false, // Disable Earth's atmosphere
    homeButton: false,
    fullscreenButton: false,
    geocoder: false,
    sceneModePicker: false,
    shouldAnimate: true,
    navigationHelpButton: false,
    // Specify WebGL context options
    contextOptions: {
      // Enable WebGL 1.0 for shader compatibility
      requestWebgl1: true,
      // Enable anisotropic texture filtering to improve rendering quality at oblique angles
      allowTextureFilterAnisotropic: true,
      webgl: {
        alpha: false,
        depth: true,
        stencil: false,
        antialias: true,
        powerPreference: "high-performance",
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
      },
    },
  });

  // Define options for Tencent imagery layer
  const options = {
    style: 4, // Style: img, 1: Classic
    crs: "WGS84",
  };

  // Add Tencent imagery layer to the viewer
  viewer.imageryLayers.add(
    new Cesium.ImageryLayer(new TencentImageryProvider(options))
  );

  // Return the initialized viewer
  return viewer;
};

/**
 * Function to set the scene properties of the Cesium viewer.
 *
 * @param {Cesium.Viewer} viewer - The Cesium viewer object to control the scene.
 *
 * @returns {undefined} This function does not return any value.
 */
export const setScene = (viewer) => {
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
 * Function to load multiple 3D tilesets into the Cesium viewer.
 *
 * @param {Cesium.Viewer} viewer - The Cesium viewer object to load the 3D tilesets into.
 * @param {Array} urls - An array of objects containing the URL and options for each 3D tileset.
 * @param {Function} [loadCb] - An optional callback function to be executed when all 3D tilesets are loaded.
 *
 * @returns {undefined} This function does not return any value.
 */
export const loadTilesets = async (viewer, urls, loadCb) => {
  const tilesets = urls.map((item) => {
    const { url, options } = item;
    let params = { url };

    if (typeof options === "object") {
      Object.assign(params, options);
    }
    const tile = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset(params)
    );
    return tile.readyPromise;
  });
  let result = await Promise.all(tilesets);
  loadCb && loadCb(result);
};

/**
 * Function to apply a default effect to a 3D tileset.
 *
 * @param {Cesium.Cesium3DTileset} tile - The 3D tileset to apply the effect to.
 *
 * @returns {undefined} This function does not return any value.
 */
export const handleDefaultModelEffect = (tile) => {
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

/**
 * Function to fly the camera to a default view.
 *
 * @param {Cesium.Viewer} viewer - The Cesium viewer object to control the camera.
 *
 * @returns {undefined} This function does not return any value.
 */
export const flyToDefaultView = (viewer) => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.95, 30.19, 34000),
    duration: 2,
    orientation: {
      heading: Cesium.Math.toRadians(35.0),
      pitch: Cesium.Math.toRadians(-37.0),
      roll: 0.0,
    },
  });
};


