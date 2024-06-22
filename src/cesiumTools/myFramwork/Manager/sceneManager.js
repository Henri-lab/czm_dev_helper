
import * as Cesium from "cesium";
import { TencentImageryProvider } from "../Map/mapPlugin";

// 初始化地图场景
export const initViewer = (container) => {
  // 初始化cesium地图对象viewer
  const viewer = new Cesium.Viewer(container, {
    timeline: false, // 是否显示时间线控件
    animation: false, // 是否显示动画控件
    baseLayerPicker: false, // 避免token
    infoBox: false, // 是否显示点击要素之后显示的信息
    selectionIndicator: false, //选中元素显示,默认true
    skyAtmosphere: false, //关闭地球光环
    homeButton: false,
    fullscreenButton: false,
    geocoder: false,
    sceneModePicker: false,
    shouldAnimate: true,
    navigationHelpButton: false,
    // 指定上下文
    contextOptions: {
      // 支持使用老版本webgl进行着色器编写
      requestWebgl1: true,
      // 开启纹理采样异性过滤，不开的话，视角越倾斜，越模糊
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

  const options = {
    style: 4, //style: img、1：经典
    crs: "WGS84",
  };
  // 添加腾讯底图
  viewer.imageryLayers.add(
    new Cesium.ImageryLayer(new TencentImageryProvider(options))
  );
  return viewer;
};

// 设置后处理效果
export const setScene = (viewer) => {
  //隐藏太阳
  viewer.scene.sun.show = false;
  //隐藏月亮
  viewer.scene.moon.show = false;
  viewer.scene.globe.enableLighting = true; // 开启全球光照

  // 泛光设置
  const bloom = viewer.scene.postProcessStages.bloom;
  bloom.enabled = false;

  // 亮度设置
  // 亮度设置
  var stages = viewer.scene.postProcessStages;
  viewer.postProcessStages.fxaa.enabled = true;
  viewer.scene.brightness =
    viewer.scene.brightness ||
    stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
  viewer.scene.brightness.enabled = true;
  viewer.scene.brightness.uniforms.brightness = 1.2;
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer._cesiumWidget._creditContainer.style.display = "none";

  viewer.shadows = false; //开启阴影效果
  viewer.shadowMap.darkness = 0.8; //阴影透明度--越大越透明
  //去cesium logo水印 或 css
  viewer.cesiumWidget.creditContainer.style.display = "none"; //去cesium logo水印

  // 场景设置
  viewer.scene.highDynamicRange = true;
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
  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;
  viewer.scene.undergroundMode = false;
  viewer.scene.terrainProvider.isCreateSkirt = false;
  viewer.scene.globe.showGroundAtmosphere = false;
  viewer.scene.globe.enableLighting = false;
  viewer.scene.fog.enabled = false;
};

// 多个3dtiles模型加载
// urls 多个3dtiles模型地址  loadCb 加载完成的回调
// urls<{url,options}>
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

export const handleDefaultModelEffect = (tile) => {
  // 处理模型着色
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
            
                // 注意shader中写浮点数是 一定要带小数点 否则会报错 比如0需要写成0.0 1要写成1.0
                float _baseHeight = minHeight; // 物体的基础高度，需要修改成一个合适的建筑基础高度
                float _heightRange = maxHeight; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange)
                float _glowRange = maxHeight; // 光环的移动范围(高度)
                // 建筑基础色
                float czm_height = positionMC.y - _baseHeight -65.0;
                float baseColor = czm_height / _heightRange;
                float bottomColor= czm_height / _heightRange*2.0;
                // 房顶给固定颜色增加立体感
                if(czm_height<29.0) {
                    material.diffuse *= vec3(bottomColor);
                }else{
                  material.diffuse *= vec3(baseColor); // 渐变
                }
            }
         `,
  });
  tile.customShader = customShader;
};

// 视角飞到全局
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
