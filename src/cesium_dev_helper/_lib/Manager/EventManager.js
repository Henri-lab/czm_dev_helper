import Manager from "./Manager";

let Cesium = new Manager().Cesium;

class EventManager extends Manager {
    constructor(viewer) {
        super(viewer);
        // In most cases, 
        // viewer.canvas and viewer.scene.canvas refer to the same <canvas> -'HTML canvas element'. 
        // Therefore, both lines of code are effectively doing the same thing, 
        // which is setting up a ScreenSpaceEventHandler on the viewer's canvas.
        const handlerOfViewer = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        // const handlerOfScene = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        this.handler = handlerOfViewer;  // Use the one that is more common in most cases.

        this.eventHandlers = new Map();
    }

    // 核心 事件执行后回调 event, pick的位置 ,pick的对象
    _addEvent(eventType, callback, priority = 0) {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
            this.handler.setInputAction((event) => {
                const pickedPos = this.viewer.scene.pickPosition(event.position || event.endPosition);
                const pickedObj = this.viewer.scene.pick(event.position || event.endPosition);
                const handlers = this.eventHandlers.get(eventType);
                // 优先度越大 越先执行
                handlers.sort((a, b) => b.priority - a.priority);
                handlers.forEach(({ callback }) => {
                    callback(event, pickedPos, pickedObj);
                });
            }, eventType);
        }

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
        this._addEvent(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK, callback, priority);
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

        this.eventHandlers.get('keydown').push({ callback, wrappedCallback, priority });
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

        this.eventHandlers.get('keyup').push({ callback, wrappedCallback, priority });
    }

    removeEventListener(callback) {
        for (const [eventType, handlers] of this.eventHandlers.entries()) {
            const index = handlers.findIndex(handler => handler.callback === callback);
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
