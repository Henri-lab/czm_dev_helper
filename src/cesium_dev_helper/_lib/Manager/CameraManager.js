import { Cartesian3, HeadingPitchRoll, Math as CesiumMath, Matrix4, JulianDate } from 'cesium';
import Manager from "./Manager";
import * as Cesium from "cesium";
// let Cesium = new Manager().Cesium;


export default class CameraManager extends Manager {
    constructor(viewer) {
        super(viewer);
        this.scene = viewer.scene;
        this.camera = viewer.camera;
        this.vehicleEntity = null;
        this.isFirstPerson = false;
        this.firstPersonOffset = new Cartesian3(0, 0, 5); // 调整摄像头相对于车辆的位置
    }
    // 更新第一人称视角
    _updateFirstPersonView() {
        if (this.isFirstPerson && this.vehicleEntity) {
            const vehiclePosition = this.vehicleEntity.position.getValue(JulianDate.now());
            const vehicleOrientation = this.vehicleEntity.orientation.getValue(JulianDate.now());

            const modelMatrix = Matrix4.fromRotationTranslation(
                Cesium.Matrix3.fromQuaternion(vehicleOrientation/*旋转四元数*/),/*旋转矩阵*/
                vehiclePosition/*平移向量*/
            );

            const cameraOffset/*局部坐标系-vehicleModel*/ = new Cartesian3(0, 0, 5); // 调整摄像头相对于车辆的位置
            const cameraPosition/*世界坐标系*/ = Matrix4.multiplyByPoint(
                modelMatrix,
                cameraOffset,
                new Cartesian3()
            );

            this.camera.setView({
                destination: cameraPosition,
                orientation: {
                    heading: CesiumMath.heading(vehicleOrientation),
                    pitch: CesiumMath.toRadians(0),
                    roll: 0
                }
            });
        }
    }
    
    // 缩放
    zoomIn() {
        this.camera.zoomIn();
    }

    zoomOut() {
        this.camera.zoomOut();
    }

    // 平移
    panLeft(distance = 100) {
        this.camera.moveLeft(distance);
    }

    panRight(distance = 100) {
        this.camera.moveRight(distance);
    }

    panUp(distance = 100) {
        this.camera.moveUp(distance);
    }

    panDown(distance = 100) {
        this.camera.moveDown(distance);
    }

    // 飞行到指定位置
    flyTo(position, options = {}) {
        const defaultOptions = {
            duration: 3,
            orientation: {
                heading: CesiumMath.toRadians(0),
                pitch: CesiumMath.toRadians(-30),
                roll: 0
            }
        };
        const finalOptions = { ...defaultOptions, ...options };
        this.camera.flyTo({
            destination: Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
            orientation: finalOptions.orientation,
            duration: finalOptions.duration
        });
    }

    // 设置视角
    setView(position, heading = 0, pitch = -30, roll = 0) {
        this.camera.setView({
            destination: Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
            orientation: {
                heading: CesiumMath.toRadians(heading),
                pitch: CesiumMath.toRadians(pitch),
                roll: CesiumMath.toRadians(roll)
            }
        });
    }

    // 重置视图
    resetView() {
        this.camera.flyHome();
    }

    // 获取当前视图位置
    getCurrentPosition() {
        const position = this.camera.positionCartographic;
        return {
            longitude: CesiumMath.toDegrees(position.longitude),
            latitude: CesiumMath.toDegrees(position.latitude),
            height: position.height
        };
    }

    // 获取当前视角
    getCurrentOrientation() {
        const heading = CesiumMath.toDegrees(this.viewer.camera.heading);
        const pitch = CesiumMath.toDegrees(this.viewer.camera.pitch);
        const roll = CesiumMath.toDegrees(this.viewer.camera.roll);
        return { heading, pitch, roll };
    }

    // 旋转视图
    rotateView(angle = 45) {
        this.camera.rotate(CesiumMath.toRadians(angle));
    }

    // 新增：切换到第一人称视角
    switchToFirstPerson(vehicleEntity) {
        this.vehicleEntity = vehicleEntity;
        this.isFirstPerson = true;
        this.scene.preRender.addEventListener(this._updateFirstPersonView, this);
    }

    // 新增：退出第一人称视角
    exitFirstPerson() {
        this.isFirstPerson = false;
        this.scene.preRender.removeEventListener(this._updateFirstPersonView, this);
    }


}


