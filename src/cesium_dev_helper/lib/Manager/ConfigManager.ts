import { ViewerConfig } from '../../type/Config';
import { parse_viewerConfig } from '../util/parse';
import Manager from './Manager';
import * as Cesium from 'cesium';
import { I_ConfigManagerClass } from '../../type/Manager';

// let Cesium = new Manager().Cesium;
// 必备
window.CESIUM_BASE_URL = 'node_modules/cesium/Build/CesiumUnminified';

/**
 * 管理生成cesium viewCesium件 并可以初始化viewer
 */
export default class ConfigManager
  extends Manager
  implements I_ConfigManagerClass
{
  data: {};
  constructor() {
    super();
    this.init_data();
  }

  /**
   * 初始化数据
   */
  init_data() {
    this.data = {};
  }

  /**
   * 初始化 Viewer
   * @param {ViewerConfig} config - 配置对象
   * @param {string} config.containerId - 容器ID
   * @param {any} config.baseConfig - Viewer 基础配置
   * @param {any} config.providerConfig - 影像地形配置列表
   * @param {{AccessToken,depthTest,canvas}} config.extraConfig - 额外配置
   * @param {boolean} all - 是否返回其他对象
   * @returns {Cesium.Viewer|{viewer,render,scene,camera}} - 返回初始化后的 Viewer 对象
   */

  async initViewer(
    config: ViewerConfig,
    all: boolean = false
  ): Promise<
    | Cesium.Viewer
    | {
        viewer: Cesium.Viewer;
        render;
        scene: Cesium.Scene;
        camera: Cesium.Camera;
      }
  > {
    // console.log(config, 'config');
    const _config = parse_viewerConfig(config);
    console.log(_config, 'parsed config');

    let viewer = new Cesium.Viewer(_config.id, _config.parsed); // 核心

    // 加载影像图层列表 -通过 viewer.imageryLayers.addImageryProvider方法
    _config.images &&
      _config.images.forEach((image) =>
        viewer.imageryLayers.addImageryProvider(image)
      );

    // 设置viewer的其他属性
    const extra = _config.extra;
    if (extra['name']) {
      Object.defineProperty(viewer, 'name', {
        value: extra['name'],
        writable: true,   // 允许写入
        configurable: true,   // 允许删除或重新定义属性
        enumerable: true,  // 属性在迭代中可见
      });
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
      const render = viewer.render;
      const camera = viewer.camera;
      return {
        viewer,
        scene,
        render,
        camera,
      };
    } else return viewer;
  }
}
