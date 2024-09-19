import {
  viewerConfig,
  imageryProviderConfig,
  terrianProviderConfig,
  mapProviderConfig,
} from '../interface/config';
import { mapProvider } from '../interface/type';
import { Viewer, ImageryProvider, TerrainProvider } from 'cesium';
// 在 Cesium 中，ImageryProvider 是一个抽象基类，所有具体的图像提供者类都继承自它。因此， UrlTemplateImageryProvider 可以将其视为 ImageryProvider 的一种实现。
// 当进行类型判断时 使用 instanceof 运算符来检查一个 UrlTemplateImageryProvider 是否是 ImageryProvider 的一个实例。
import {
  isValidProvider,
  isValidTerrianProviderType,
  isValidImageryProviderType,
  isValidViewerProperty,
} from './isValid';
import * as Cesium from 'cesium';
// viewer默认配置 原生
let vConfig_native = /**@default*/ {
  contextOptions: {
    requestWebgl2: true,
    webgl: {
      alpha: true,
      depth: true,
      stencil: true,
      antialias: true,
      powerPreference: 'high-performance',
      webgl2: WebGL2RenderingContext ? true : false, // 启用 WebGL 2 失败
    },
  },
  // useDefaultRenderLoop: false,
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
  showRenderLoopErrors: true,
};
export const parse_viewerConfig = (viewerConfig: viewerConfig) => {
  let { containerId, baseConfig, providerConfig, extraConfig } = viewerConfig;
  let images = [];
  let terrian: any = {};
  // 配置token
  Cesium.Ion.defaultAccessToken =
    extraConfig['AccessToken'] || import.meta.env.VITE_CESIUM_KEY;
  // 过滤无效配置
  for (const key in baseConfig) {
    if (baseConfig[key] === undefined || !isValidViewerProperty(key))
      //  if (baseConfig[key] === undefined)
      delete baseConfig[key];
  }
  vConfig_native = Object.assign(vConfig_native, baseConfig);
  if (providerConfig) {
    const info /*地形数据和影像数据的配置信息*/ =
      parseProviderConfig(providerConfig);
    // 地形数据配置(viewer)
    // 加载地形列表 -通过配置选项
    // 一般来说地形provider只有一个就够,多个可能是有切地形需求
    for (const type in info.tMap) {
      // 地形provider配置(viewer.terrainProvider)
      const option = info.tMap[type];
      terrian.terrainProvider = createProvider({
        type,
        option,
      }) as TerrainProvider;
    }
    //根据 影像配置 生成 provider
    for (const type in info.iMap) {
      const option = info.iMap[type];
      if (isValidImageryProviderType(type)) {
        if (
          option.customProvider /*&& option.customProvider instanceof Cesium.ImageryProvider 经过测试 这个条件导致有些自定义影像会被阻止*/
        ) {
          images.push(option.customProvider);
        } else {
          const provider = createProvider({
            type,
            option, //delete option.customProvider;
          }) as ImageryProvider;
          provider && images.push(provider);
        }
      }
    }
  }
  return {
    id: containerId,
    parsed: { ...vConfig_native, ...terrian },
    images,
    extra: extraConfig,
  };
};

/**
 * 分类  cesium provider 为 imagery 和 terrian
 * @param {Object} options - 提供者配置选项
 * @returns {Object} - 返回配置对象
 */
function parseProviderConfig(options: mapProviderConfig): any {
  let tMap: any = {}; //存储地形类型和配置
  let iMap: any = {}; //存储影像类型和配置

  for (const sub_type in options) {
    const sub_configs = options[sub_type];

    if (!sub_configs) continue;

    if (sub_type === 'terrainProvider')
      //地形provider类型属性  通常只需要一个地形provider
      sub_configs.forEach(
        (config: { type: string; option: any }) =>
          isValidTerrianProviderType(config.type) &&
          (tMap[config.type] = config.option)
      );
    else if (sub_type === 'imageryProvider')
      //影像provider类型
      sub_configs.forEach(
        (config: { type: string; option: any }) =>
          isValidImageryProviderType(config.type) &&
          (iMap[config.type] = config.option)
      );
  }
  return {
    tMap,
    iMap,
  };
}

/**
 * 创建 Cesium 提供者实例
 * @param {Object} config - 提供者配置
 * @param {string} config.type - 提供者类型
 * @param {Object} config.option - 提供者选项
 * @returns {Object} - 返回提供者实例
 */
function createProvider(config: {
  type: string;
  option: mapProvider;
}): mapProvider | void {
  if (isValidProvider(config.type)) {
    const czm: any = Cesium;
    const ProviderClass = czm[config.type]; //后续 添加 检查
    return new ProviderClass(config.option);
  } else {
    console.warn(`${config.type} is not the valid provider type`);
  }
}
