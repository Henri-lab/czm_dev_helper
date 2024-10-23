import * as Cesium from 'cesium';

export default class EntityDragger {
    constructor(viewer, dataSource) {
        this.dataSource = dataSource;
        this.viewer = viewer;
        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        this.draggedEntity = null;
        this.isDragging = false;
    }
    enable() {
        const viewer = this.viewer;
        // Initialize mouse down event
        this.handler.setInputAction((movement) => {

            let pickedObject, pickedEntity;
            if (!this.dataSource) {
                pickedObject = viewer.scene.pick(movement.position);
                pickedEntity = pickedObject.id

            } else {
                pickedEntity = this.filterFromDataSource(movement.position)
            }
            if (Cesium.defined(pickedEntity)) {
                console.log(`dragger start from datasource -- ${this.dataSource.name ? this.dataSource.name : '#viewer#'}`)
                this.draggedEntity = pickedEntity;
                this.isDragging = true;
                this.disableCameraControls();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        // Initialize mouse move event
        this.handler.setInputAction((movement) => {
            if (this.isDragging && this.draggedEntity) {
                const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
                if (cartesian) {
                    this.draggedEntity.position = cartesian;
                }
            } else {
                this.enableCameraControls()
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // Initialize mouse up event
        this.handler.setInputAction(() => {
            console.log(`dragger over`)
            this.isDragging = false;
            this.draggedEntity = null;
            this.enableCameraControls();
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }
    // Disable camera controls during dragging
    disableCameraControls() {
        const controller = this.viewer.scene.screenSpaceCameraController;
        controller.enableRotate = false;
        controller.enableTranslate = false;
        controller.enableZoom = false;
        controller.enableTilt = false;
        controller.enableLook = false;
    }

    // Enable camera controls after dragging
    enableCameraControls() {
        const controller = this.viewer.scene.screenSpaceCameraController;
        controller.enableRotate = true;
        controller.enableTranslate = true;
        controller.enableZoom = true;
        controller.enableTilt = true;
        controller.enableLook = true;
    }

    // Pick an entity from the specified data source
    filterFromDataSource(position) {
        const pickedObject = this.viewer.scene.pick(position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const entity = pickedObject.id;

            // Check if the picked entity belongs to the given data source
            if (this.dataSource.entities.contains(entity)) {
                return entity;
            }
        }
        return null;
    }
    destroy() {
        this.handler.destroy();
    }
}
