import Manager from './Manager';
import { I_EventManagerClass } from '../../type/Manager';
import {
  OrderedCallback,
  KeyboardEventFunction,
  HandlePickedFunction,
  CzmPickedRes,
} from '../../type';

import * as Cesium from 'cesium';
// let Cesium = new Manager().Cesium;

class EventManager extends Manager implements I_EventManagerClass {
  handler: Cesium.ScreenSpaceEventHandler;
  eventHandlers: Map<
    Cesium.ScreenSpaceEventType | number | string, //Number,Enum
    Array<OrderedCallback>
  >;
  listenerOfKeyUp: KeyboardEventFunction;
  listenerOfKeyDown: KeyboardEventFunction;
  constructor(viewer: Cesium.Viewer) {
    super(viewer);
    // In most cases,
    // viewer.canvas and viewer.scene.canvas refer to the same <canvas> -'HTML canvas element'.
    // Therefore, both lines of code are effectively doing the same thing,
    // which is setting up a ScreenSpaceEventHandler on the viewer's canvas.
    const handlerOfViewer = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    // const handlerOfScene = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.handler = handlerOfViewer; // Use the one that is more common in most cases.

    this.eventHandlers = new Map();

    this.listenerOfKeyUp = (event: KeyboardEvent) => {
      const handlers = this.eventHandlers.get('up');
      handlers &&
        handlers.sort(
          (a: OrderedCallback, b: OrderedCallback) => b.priority - a.priority
        );
      handlers.forEach((item) => {
        item.callback(event, event.key);
      });
    };
    this.listenerOfKeyDown = (event) => {
      const handlers = this.eventHandlers.get('keyup');
      handlers &&
        handlers.sort(
          (a: OrderedCallback, b: OrderedCallback) => b.priority - a.priority
        );
      handlers.forEach((item) => {
        item.callback(event);
      });
    };
  }
  getViewer(){
    return this.viewer;
  }
  getNewHandler() {
    return new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
  }
  // 核心 事件执行后回调 event, pick的位置 ,pick的对象
  _addEvent(
    eventType: Cesium.ScreenSpaceEventType,
    callback: HandlePickedFunction,
    priority = 0
  ) {
    // console.log('addEvent', this.eventHandlers);

    let that = this;
    if (!that.eventHandlers.has(eventType)) {
      // 如果该事件类型还没有被添加过 就创建一个容器管理这个类型
      let emptyActions: Array<OrderedCallback> = [];
      that.eventHandlers.set(eventType, emptyActions);
      // 调用cesium事件处理程序
      that.handler.setInputAction(
        (event: {
          position: Cesium.Cartesian2;
          endPosition: Cesium.Cartesian2;
        }) => {
          // 点击处的笛卡尔坐标🗽
          let pickedPos: Cesium.Cartesian3 | undefined;
          if (that.viewer.scene.pickPositionSupported) {
            pickedPos = that.viewer.scene.pickPosition(
              //被实体遮挡会失效
              event.position || event.endPosition,
              pickedPos
            );
            if (!pickedPos) {
              const ray = that.viewer.camera.getPickRay(
                event.position || event.endPosition
              );
              pickedPos = that.viewer.scene.globe.pick(ray, that.viewer.scene);
            }
          } else {
            pickedPos = that.viewer.scene.camera.pickEllipsoid(
              event.position || event.endPosition,
              that.viewer.scene.globe.ellipsoid
            );
          }
          // 点击处或者移动处的物体
          const pickedObj: CzmPickedRes = that.viewer.scene.pick(
            event.position || event.endPosition
          );
          // 获取这个eventType需要做什么动作（action）
          const actions = that.eventHandlers.get(eventType);
          //降序 action的优先度越小 越先遍历到 越先执行
          actions.sort(
            (a: OrderedCallback, b: OrderedCallback) => a.priority - b.priority
          );
          // 依次执行action的操作
          actions.forEach(({ callback }) => {
            // 传回 事件和pick的位置和pick的对象
            callback(event, pickedPos, pickedObj);
          });
        },
        eventType
      );
    }
    // 获得某个eventType的所有行为actions：{ callback, priority }
    that.eventHandlers.get(eventType).push({ callback, priority });
  }

  /**
   *  @callback参数 -(event, pick的位置 ,pick的对象)
   */
  onMouseClick(callback: HandlePickedFunction, priority = 0) {
    let that = this;
    that._addEvent(Cesium.ScreenSpaceEventType.LEFT_CLICK, callback, priority);
  }
  /**
   *  @callback参数 -(event, pick的位置 ,pick的对象)
   */
  onMouseRightClick(callback: HandlePickedFunction, priority = 0) {
    let that = this;
    that._addEvent(Cesium.ScreenSpaceEventType.RIGHT_CLICK, callback, priority);
  }
  /**
   *  @callback参数 -(event, pick的位置 ,pick的对象)
   */
  onMouseDoubleClick(callback: HandlePickedFunction, priority = 0) {
    let that = this;
    that._addEvent(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
      callback,
      priority
    );
  }

  onMouseDown(callback: HandlePickedFunction, priority = 0) {
    let that = this;
    that._addEvent(Cesium.ScreenSpaceEventType.LEFT_DOWN, callback, priority);
  }

  onMouseUp(callback: HandlePickedFunction, priority = 0) {
    let that = this;
    that._addEvent(Cesium.ScreenSpaceEventType.LEFT_UP, callback, priority);
  }
  /**
   *  @callback参数 -(event, pick的位置 ,pick的对象)
   */
  onMouseMove(callback: HandlePickedFunction, priority = 0) {
    let that = this;
    that._addEvent(Cesium.ScreenSpaceEventType.MOUSE_MOVE, callback, priority);
  }

  onMouseWheel(callback: HandlePickedFunction, priority = 0) {
    let that = this;
    that._addEvent(Cesium.ScreenSpaceEventType.WHEEL, callback, priority);
  }

  init_KeyboardListener_And_Actions() {
    let that = this;
    if (!that.eventHandlers.has('keydown')) {
      that.eventHandlers.set('keydown', []);
    }
    if (!that.eventHandlers.has('keyup')) {
      that.eventHandlers.set('keyup', []);
    }
    window.addEventListener('keyup', that.listenerOfKeyUp);
    window.addEventListener('keydown', that.listenerOfKeyDown);
  }
  onKeyDown(callback: KeyboardEventFunction, priority = 0) {
    let that = this;
    const wrappedCallback: KeyboardEventFunction = (event: KeyboardEvent) =>
      callback(event, event.key);
    that.eventHandlers
      .get('keydown')
      .push({ callback: wrappedCallback, priority });
  }

  onKeyUp(callback: KeyboardEventFunction, priority = 0) {
    let that = this;
    const wrappedCallback: KeyboardEventFunction = (event: KeyboardEvent) =>
      callback(event, event.key);

    that.eventHandlers
      .get('keyup')
      .push({ callback: wrappedCallback, priority });
  }

  removeEventListener(callback: any) {
    let that = this;
    for (const [eventType, actions] of that.eventHandlers.entries()) {
      if (eventType === 'keydown') {
        window.removeEventListener(eventType, callback);
      }
      if (eventType === 'keyup') {
        window.removeEventListener(eventType, that.listenerOfKeyUp);
      }
      //update events map
      const index = actions.findIndex(
        (item: OrderedCallback) => item.callback === callback
      );
      if (index !== -1) {
        actions.splice(index, 1);
        if (actions.length === 0) {
          that.eventHandlers.delete(eventType);
        }
        // console.log('removeEvent', this.eventHandlers);
        return;
      }
    }
  }

  clear() {
    let that = this;
    that.destroy();
    that.handler = new Cesium.ScreenSpaceEventHandler(that.viewer.canvas);
  }

  updateHandler(updateOptions?) {
    if (!updateOptions) {
      this.clear();
      return this.handler;
    }
  }

  destroy() {
    let that = this;
    that.handler && that.handler.destroy();
    for (const [eventType, handlers] of that.eventHandlers.entries()) {
      if (eventType === 'keydown' || eventType === 'keyup') {
        window.removeEventListener(eventType, that.listenerOfKeyDown);
        window.removeEventListener(eventType, that.listenerOfKeyUp);
      }
      // handlers.length = 0;
    }
    that.eventHandlers.clear();
  }
}

export default EventManager;
