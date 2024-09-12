import { render, createVNode, ComponentInstance, VNode } from 'vue';
import * as Cesium from 'cesium';
import { Viewer } from 'cesium';
import {
  PopupCreator as PopupCreatorInterface,
  PopupOptions,
} from '../interface/PopupCreator';

/**
 * A class for creating and managing custom object popups in a Cesium application.
 * @class
 */
class PopupCreator implements PopupCreatorInterface {
  viewer: Viewer;
  vnode!: VNode; //!来表示非空断言。
  position: Cesium.Cartesian3;
  label: string;
  isShow: boolean;
  color: string;
  fields: any[];
  values: any[];
  attr: Record<string, any>;
  popupType: string;
  offset: number[];
  popupRoutes: Record<string, () => Promise<{ default: any }>>;
  queryPopup: any | null;
  isDisplay: boolean;
  mountNode: HTMLElement | null;
  scaleByDistance: Cesium.NearFarScalar;

  // 点击popup的回调
  clickHandler: () => void;
  constructor(
    viewer: Cesium.Viewer,
    options: PopupOptions,
    pathOfVueComponentMap: Record<string, () => Promise<{ default: any }>>,
    clickHandler: () => void
  ) {
    this.viewer = viewer;
    this.position = Cesium.defaultValue(
      options.position,
      Cesium.Cartesian3.ZERO
    );
    this.label = Cesium.defaultValue(options.label, 'label');
    this.isShow = Cesium.defaultValue(options.isShow, true);
    this.color = Cesium.defaultValue(options.color, '#ff0000');
    this.fields = Cesium.defaultValue(options.fields, []);
    this.values = Cesium.defaultValue(options.values, []);
    this.attr = Cesium.defaultValue(options.attr, {});
    this.popupType = Cesium.defaultValue(options.type, 'marker');
    this.offset = Cesium.defaultValue(options.offset, [0, 0]);
    this.popupRoutes = pathOfVueComponentMap;
    this.queryPopup = null;
    this.isDisplay = true;
    this.mountNode = null;
    this.scaleByDistance = Cesium.defaultValue(
      options.scaleByDistance,
      new Cesium.NearFarScalar(1000, 1, 20000, 0.4)
    );
    this.clickHandler = clickHandler;
  }
  // 手动根据距离计算显示级别
  calcaluteGrade(curValue: number, stdNearFar: Cesium.NearFarScalar): number {
    let curPara = 0;
    if (curValue <= stdNearFar.near) {
      curPara = stdNearFar.nearValue;
    } else if (curValue >= stdNearFar.far) {
      curPara = stdNearFar.farValue;
    } else {
      const totalGrade = Math.ceil(
        Math.log(stdNearFar.far / stdNearFar.near) / Math.log(2)
      );
      const curGrade = Math.round(
        Math.log(curValue / stdNearFar.near) / Math.log(2)
      );
      curPara =
        stdNearFar.nearValue +
        ((stdNearFar.farValue - stdNearFar.nearValue) * curGrade) / totalGrade;
    }
    return curPara;
  }

  // 场景渲染事件 实时更新标签的位置 使其与笛卡尔坐标一致
  postRender(): void {
    if (!this.vnode?.el || !this.vnode.el.style) return;
    const canvasHeight = this.viewer.scene.canvas.height;
    const windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      this.position,
      windowPosition
    );
    this.vnode.el.style.bottom =
      canvasHeight - windowPosition.y + this.offset[1] + 'px';
    const elWidth = this.vnode.el.offsetWidth;
    this.vnode.el.style.left =
      windowPosition.x - elWidth / 2 + this.offset[0] + 'px';
    const cameraHeight = Math.ceil(
      this.viewer.camera.positionCartographic.height
    );
    const scaleSize = this.calcaluteGrade(cameraHeight, this.scaleByDistance);
    this.vnode.el.style.transform = `scale(${scaleSize},${scaleSize})`;
    if (this.isDisplay) {
      const condition1 =
        windowPosition.y < 0 || windowPosition.y > canvasHeight;
      const condition2 = this.viewer.camera.positionCartographic.height > 12000;
      const condition3 =
        windowPosition.x < 0 ||
        windowPosition.x > this.viewer.scene.canvas.width;
      if (condition1 || condition2 || condition3) {
        this.vnode.el.style.display = 'none';
      } else {
        this.vnode.el.style.display = 'block';
      }
    }
  }

  // 添加场景事件
  addPostRender(): void {
    this.viewer.scene.postRender.addEventListener(
      this.postRender.bind(this),
      this /* 'this' of 'this.postRender' is this*/
    );
  }

  // 挂载HTML元素 label
  async addLabel(
    type: string,
    options?: PopupOptions
  ): Promise<HTMLElement | null> {
    if (!this.popupRoutes[type]) {
      return null;
    }
    const _import_ = await this.popupRoutes[type](); //异步的 动态import
    const vnode = createVNode(
      _import_.default /*export default Vue Component */,
      {
        // 传递所有可用的属性，组件内部使用$attrs调用
        // 在 Vue 3 中，$attrs 依然存在并且功能与 Vue 2 类似。它可以捕获从父组件传递但没有在子组件中定义为 props 的属性。

        // 作用：$attrs 会收集传递到子组件但未在 props 中显式声明的所有属性。
        // 典型用途：用于高阶组件或包装组件，它们需要将未知的属性传递给内部组件。
        ...{
          label: this.label,
          color: this.color,
          position: this.position,
          attr: this.attr,
          clickCallback: () => {
            this.clickHandler();
          },
          closePopup: () => {
            this.removeMarker();
          },
          fields: this.fields,
          values: this.values,
        },
      }
    );
    const mountNode = document.createElement('div');
    render(vnode, mountNode);
    this.viewer.cesiumWidget.container.appendChild(mountNode);
    this.addPostRender();
    vnode.el && (vnode.el.style.display = options?.isShow ? 'block' : 'none');
    this.vnode = vnode;
    this.mountNode = mountNode;
    return mountNode;
  }

  // 移除HTML元素
  removeMarker(): void {
    if (this.mountNode) {
      render(null, this.mountNode); // 销毁 VNode
      this.viewer.cesiumWidget.container.removeChild(this.mountNode);
      this.viewer.scene.postRender.removeEventListener(this.postRender, this);
      this.mountNode = null;
    }
  }
}

export default PopupCreator;
