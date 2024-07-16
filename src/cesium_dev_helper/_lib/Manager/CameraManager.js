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
        this.animationFrameId = null; // 用于存储 requestAnimationFrame 返回的 ID✨
        this.rotatedEarthAngleSum = 0;//用于累加旋转角度
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
            this.setView({ destination: cameraPosition, heading: CesiumMath.heading(vehicleOrientation), pitch: CesiumMath.toRadians(0), roll: 0 })
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
    flyTo({ position, effectOptions = {} }) {
        const defaultOptions = {
            duration: 3,
            orientation: {
                heading: CesiumMath.toRadians(0),
                pitch: CesiumMath.toRadians(-30),
                roll: 0
            }
        };
        const finalOptions = { ...defaultOptions, ...effectOptions };
        this.camera.flyTo({
            destination: Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
            orientation: finalOptions.orientation,
            duration: finalOptions.duration
        });
    }

    // 设置视角的三种方案

    // 精度和控制程度最高
    setView({ destination, heading = 0, pitch = -30, roll = 0 }) {
        let _destination;
        if (typeof destination === 'object') {
            const { longitude, latitude, height } = destination;
            _destination = Cartesian3.fromDegrees(longitude, latitude, height)
        }
        this.camera.setView({
            destination: _destination || Cartesian3.ZERO,
            orientation: {
                heading: CesiumMath.toRadians(heading),
                pitch: CesiumMath.toRadians(pitch),
                roll: CesiumMath.toRadians(roll)
            }
        });
    }

    // 精度和控制程度比lookat更高
    setCameraLookAtTransform(targetPosition, offset = new Cesium.Cartesian3(0.0, 0.0, 0.0)) {
        this.scene.preRender.addEventListener((scene, time) => {
            const position = targetPosition.getValue(time);
            if (position) {
                const transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);//将局部东、北、上（ENU）坐标系转换为地心地固（ECF）坐标系。生成一个以目标位置为原点的变换矩阵。
                this.camera.lookAtTransform(transform, offset);//目标位置默认在视野正中心 并根据offset进行调整
            }
        });
    }
    // 精度和控制程度较低 但是除了 指定trackEntity的方法 外最方便
    setCameraLookAt(targetPosition, offset = new Cesium.Cartesian3(0.0, 0.0, 0.0)) {
        this.scene.preRender.addEventListener((scene, time) => {
            const position = targetPosition.getValue(time);
            if (position) {
                this.camera.lookAt(position, offset);
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

    // 地球旋转
    // 可以转特定角度,默认为自动循环旋转

    // 开始旋转
    /**
 * Enables or disables the earth's rotation.
 *
 * @param {boolean} flag - A flag indicating whether to enable or disable the rotation.
 * @param {number} [angle] - The initial angle of rotation in degrees. Default is 0.
 * @param {number} [speed] - The speed of rotation in degrees per frame. Default is 0.1.
 *
 * @returns {void}
 */
    isRotationEnabled(flag, angle, speed) {
        this.rotatedEarthAngleSum = 0;
        let _animationFrameId = this.animationFrameId;
        // --辅助函数--
        // 开启旋转 
        const _startRotation = (angle, speed) => {
            if (!_animationFrameId) {
                this.rotateEarth(angle, speed); // 开始旋转
            }
        }
        // 停止旋转
        function _stopRotation() {
            if (_animationFrameId) {
                console.log('sssss')
                cancelAnimationFrame(_animationFrameId); // 取消下一帧请求
                _animationFrameId = null; // 清空 animationFrameId
            }
        }

        //中央✨
        if (flag) {
            // 开启旋转 
            const defaultAngle = 0;
            const defaultSpeed = 0.1;
            const _angle = angle || defaultAngle
            const _speed = speed || defaultSpeed;
            _startRotation(_angle, _speed);
        } else {
            // 关闭旋转
            console.log('close rotate')
            _stopRotation();
        }


    }
    /**
     * Rotates the earth around its center axis.
     *
     * @param {number} [angle] - The initial angle of rotation in degrees. If not provided, the earth will start rotating from its current position.
     * @param {number} [speed] - The speed of rotation in degrees per frame. Default is 0.1.
     *
     * @returns {void}
     */
    // 角度用弧度计算💥
    rotateEarth(angle, speed) {
        let that = this,
            scene = that.scene,
            camera = that.camera,
            _angle = angle || CesiumMath.toRadians(that.rotatedEarthAngleSum)//开启无限自转时 angle=0 ,_angle取出之前的累积角度

        if (angle) {
            // scene.globe.rotation 属性是一个 实验性 特性，
            // 可能在不同的 Cesium 版本中会有所变化或不完全支持。
            // 通过修改地球的旋转角度，可以实现地球的旋转效果。
            scene.globe.rotation = CesiumMath.toRadians(angle);
        }
        else if (angle === 0) {
            // 设置旋转参数
            const center = Cesium.Cartesian3.ZERO; // 地球中心点
            const axis = Cesium.Cartesian3.UNIT_Z; // 旋转轴，Z 轴

            // 更新角度
            _angle += Cesium.Math.toRadians(speed); // 默认每帧旋转0.1度
            that.rotatedEarthAngleSum = _angle; //记录角度

            // 获取当前相机位置
            const cameraPosition = camera.position;
            const cameraUp = camera.up;
            const cameraDirection = camera.direction;

            // 计算旋转矩阵 核心💫
            const rotationMatrix = Cesium.Matrix3.fromRotationZ(_angle);

            // 应用旋转矩阵到相机的位置、方向和上向量
            const rotatedPosition = Cesium.Matrix3.multiplyByVector(rotationMatrix, cameraPosition, new Cesium.Cartesian3());
            const rotatedUp = Cesium.Matrix3.multiplyByVector(rotationMatrix, cameraUp, new Cesium.Cartesian3());
            const rotatedDirection = Cesium.Matrix3.multiplyByVector(rotationMatrix, cameraDirection, new Cesium.Cartesian3());

            // 设置相机的新位置、方向和上向量
            camera.position = rotatedPosition;
            camera.up = rotatedUp;
            camera.direction = rotatedDirection;

            // 设置相机的新位置
            camera.lookAt(center, rotatedPosition);

            // 请求下一帧✨
            that.animationFrameId = requestAnimationFrame(() => {
                // console.log('rotating-animationFrameId', that.animationFrameId);
                that.rotateEarth(0, speed);
            });


            // 📌📌📌requestAnimationFrame的使用细节📌📌📌---------------------------------------
            // --requestAnimationFrame 函数的参数需要传递一个函数引用，而不是直接调用函数。
            // 如果直接调用 that.rotateEarth，会失去上下文绑定导致问题。
            // 以下几种方法确保上下文绑定正确，并使循环正常运行：
            // 1.使用 bind方法👻 绑定上下文。
            // 2.使用 箭头函数👻 保留上下文。
            // ——like 1：————————————————————————————————————————————————————————————————
            //   rotateEarth(angle = 0) {
            //       console.log('🎠');
            //       requestAnimationFrame(this.rotateEarth.bind(this));
            //   }
            // ——like 2：————————————————————————————————————————————————————————————————
            //   rotateEarth(angle = 0) {
            //       console.log('🎠');
            //       requestAnimationFrame(() => rotateEarth(angle));
            //   }
            // -------------------------------------------------------------------------
            // requestAnimationFrame(that.rotateEarth().bind(that)); //--传函数返回结果--👺栈溢出了
            // requestAnimationFrame(that.rotateEarth.bind(that));//--传函数 👺没效果 
        }
    }
}


