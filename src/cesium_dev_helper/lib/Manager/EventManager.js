import Manager from './Manager';

import * as Cesium from 'cesium';
// let Cesium = new Manager().Cesium;

class EventManager extends Manager {
  constructor(viewer) {
    super(viewer);
    // In most cases,
    // viewer.canvas and viewer.scene.canvas refer to the same <canvas> -'HTML canvas element'.
    // Therefore, both lines of code are effectively doing the same thing,
    // which is setting up a ScreenSpaceEventHandler on the viewer's canvas.
    const handlerOfViewer = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    // const handlerOfScene = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.handler = handlerOfViewer; // Use the one that is more common in most cases.

    this.eventHandlers = new Map();
  }

  // 核心 事件执行后回调 event, pick的位置 ,pick的对象
  _addEvent(eventType, callback, priority = 0) {
    if (!this.eventHandlers.has(eventType)) {
      // 如果该事件类型还没有被添加过 就创建一个容器管理这个类型
      this.eventHandlers.set(eventType, []);
      // 调用cesium事件处理程序
      this.handler.setInputAction((event) => {
        // 点击处的笛卡尔坐标🗽
        let pickedPos
        if (this.viewer.scene.pickPositionSupported) {
          pickedPos = this.viewer.scene.pickPosition(
            event.position ||
            event.endPosition);
        } else {
          pickedPos = this.viewer.scene.camera.pickEllipsoid(
            event.position ||
            event.endPosition, this.viewer.scene.globe.ellipsoid);
        }
        // 点击处或者移动处的物体
        const pickedObj = this.viewer.scene.pick(
          event.position || event.endPosition
        );
        // 获取这个eventType需要做什么动作（action）
        const actions = this.eventHandlers.get(eventType);
        //降序 action的优先度越小 越先遍历到 越先执行
        actions.sort((a, b) => a.priority - b.priority);
        // 依次执行action的操作
        actions.forEach(({ callback }) => {
          // 传回 事件和pick的位置和pick的对象
          callback(event, pickedPos, pickedObj);
        });
      }, eventType);
    }
    // 获得某个eventType的所有行为actions：{ callback, priority }
    this.eventHandlers.get(eventType).push({ callback, priority });
  }

  /**
   *  @callback参数 -(event, pick的位置 ,pick的对象)
   */
  onMouseClick(callback, priority = 0) {
    this._addEvent(Cesium.ScreenSpaceEventType.LEFT_CLICK, callback, priority);
  }
  /**
   *  @callback参数 -(event, pick的位置 ,pick的对象)
   */
  onMouseRightClick(callback, priority = 0) {
    this._addEvent(Cesium.ScreenSpaceEventType.RIGHT_CLICK, callback, priority);
  }
  /**
   *  @callback参数 -(event, pick的位置 ,pick的对象)
   */
  onMouseDoubleClick(callback, priority = 0) {
    this._addEvent(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
      callback,
      priority
    );
  }

  onMouseDown(callback, priority = 0) {
    this._addEvent(Cesium.ScreenSpaceEventType.LEFT_DOWN, callback, priority);
  }

  onMouseUp(callback, priority = 0) {
    this._addEvent(Cesium.ScreenSpaceEventType.LEFT_UP, callback, priority);
  }
  /**
   *  @callback参数 -(event, pick的位置 ,pick的对象)
   */
  onMouseMove(callback, priority = 0) {
    this._addEvent(Cesium.ScreenSpaceEventType.MOUSE_MOVE, callback, priority);
  }

  onMouseWheel(callback, priority = 0) {
    this._addEvent(Cesium.ScreenSpaceEventType.WHEEL, callback, priority);
  }

  onKeyDown(callback, priority = 0) {
    const wrappedCallback = (event) => callback(event.key, event);
    if (!this.eventHandlers.has('keydown')) {
      this.eventHandlers.set('keydown', []);
      window.addEventListener('keydown', (event) => {
        const handlers = this.eventHandlers.get('keydown');
        handlers.sort((a, b) => b.priority - a.priority);
        handlers.forEach(({ wrappedCallback }) => {
          wrappedCallback(event);
        });
      });
    }

    this.eventHandlers
      .get('keydown')
      .push({ callback, wrappedCallback, priority });
  }

  onKeyUp(callback, priority = 0) {
    const wrappedCallback = (event) => callback(event.key, event);
    if (!this.eventHandlers.has('keyup')) {
      this.eventHandlers.set('keyup', []);
      window.addEventListener('keyup', (event) => {
        const handlers = this.eventHandlers.get('keyup');
        handlers.sort((a, b) => b.priority - a.priority);
        handlers.forEach(({ wrappedCallback }) => {
          wrappedCallback(event);
        });
      });
    }

    this.eventHandlers
      .get('keyup')
      .push({ callback, wrappedCallback, priority });
  }

  removeEventListener(callback) {
    for (const [eventType, handlers] of this.eventHandlers.entries()) {
      const index = handlers.findIndex(
        (handler) => handler.callback === callback
      );
      if (index !== -1) {
        handlers.splice(index, 1);
        if (handlers.length === 0) {
          this.eventHandlers.delete(eventType);
          if (eventType === 'keydown' || eventType === 'keyup') {
            window.removeEventListener(eventType, handlers.wrappedCallback);
          } else {
            this.handler.removeInputAction(eventType);
          }
        }
        break;
      }
    }
  }

  destroy() {
    this.handler.destroy();
    for (const [eventType, handlers] of this.eventHandlers.entries()) {
      if (eventType === 'keydown' || eventType === 'keyup') {
        window.removeEventListener(eventType, handlers.wrappedCallback);
      }
    }
    this.eventHandlers.clear();
  }
}

export default EventManager;
