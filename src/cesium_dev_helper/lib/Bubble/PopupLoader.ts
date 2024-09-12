import PopupCreator from '../Creator/PopupCreator';
import * as Cesium from 'cesium';
import { PopupOptions } from '../interface/PopupCreator';

// route，cb硬编码
const pathOfVueComponentMap = {
  marker: () => import('./MakerTemplate.vue'),
  carPopup: () => import('./PopupCar.vue'),
  queryPopup: () => import('./PopupQuery.vue'),
};
// PopupLoader 负责动态加载 目录下的vue组件
class PopupLoader extends PopupCreator {
  constructor(viewer: any, options: any) {
    // 假设 viewer 和 options 的类型未知
    // --天气查询气泡(clickCallback)
    async function showQueryPopup(): Promise<void> {}
    super(viewer, options, pathOfVueComponentMap, showQueryPopup);
  }

  // --移除查询气泡
  removeQueryPopup(): void {
    this.queryPopup && this.queryPopup.removeMarker();
  }
}

export default PopupLoader;
