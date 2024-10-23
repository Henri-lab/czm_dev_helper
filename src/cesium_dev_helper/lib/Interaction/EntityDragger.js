import * as Cesium from 'cesium';

export default class EntityDragger {
    constructor(viewer) {
        this.viewer = viewer;
        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        this.draggedEntity = null;
        this.isDragging = false;
    }
    enable() {
        const viewer = this.viewer;
        // Initialize mouse down event
        this.handler.setInputAction((movement) => {
            const pickedObject = viewer.scene.pick(movement.position);
            if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
                this.draggedEntity = pickedObject.id;
                this.isDragging = true;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        // Initialize mouse move event
        this.handler.setInputAction((movement) => {
            if (this.isDragging && this.draggedEntity) {
                const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
                if (cartesian) {
                    this.draggedEntity.position = cartesian;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // Initialize mouse up event
        this.handler.setInputAction(() => {
            this.isDragging = false;
            this.draggedEntity = null;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    destroy() {
        this.handler.destroy();
    }
}
