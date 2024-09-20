import * as Cesium from 'cesium';
import * as THREE from 'three';
// 定义 ThreeJSPrimitive 类
export default class PrimitiveThreeJS {
  constructor(threeScene, threeCamera, threeRenderer, viewer) {
    this.threeScene = threeScene;
    this.threeCamera = threeCamera;
    this.threeRenderer = threeRenderer;
    this.viewer = viewer;
    // 缓存向量
    this.threePosition = new THREE.Vector3();
    this.threeTarget = new THREE.Vector3();
    this.threeUp = new THREE.Vector3();

    // 创建 DrawCommand，只需创建一次
    this.drawCommand = new Cesium.DrawCommand({
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      boundingVolume: new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, Infinity),
      pass: Cesium.Pass.OPAQUE,
      owner: this,
      execute: this.execute.bind(this),
    });
  }

  // 更新方法，在每一帧都会被 Cesium 调用
  update(frameState) {
    // 如果场景未准备好，跳过渲染
    if (!this.viewer.scene) return;

    // 同步 Three.js 相机与 Cesium 相机
    this.updateCamera();

    // 将 DrawCommand 添加到命令列表中
    frameState.commandList.push(this.drawCommand);
  }

  // execute() {
  //   const context = this.viewer.scene.context;
  //   const gl = context._gl;

  //   // 保存 Cesium 的 WebGL 状态
  //   const originalFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);

  //   // 清除深度缓冲区
  //   gl.clear(gl.DEPTH_BUFFER_BIT);

  //   // 执行 Three.js 渲染
  //   this.threeRenderer.state.reset();
  //   this.threeRenderer.render(this.threeScene, this.threeCamera);

  //   // 重置 Three.js 的渲染状态
  //   this.threeRenderer.state.reset();

  //   // 绑定回 Cesium 的默认帧缓冲区
  //   gl.bindFramebuffer(gl.FRAMEBUFFER, originalFramebuffer);

  //   // 重置 Cesium 的渲染状态
  //   context.reset();
  // }
  execute() {
    // 重置 Cesium 的渲染状态
    const context = this.viewer.scene.context;
    context.bindRenderState(Cesium.RenderState.fromCache());

    // 清除深度缓冲区，以确保 Three.js 对象正确渲染
    context.clear({
      framebuffer: undefined,
      color: false,
      depth: true,
      stencil: false,
    });

    // 执行 Three.js 渲染
    this.threeRenderer.state.reset();
    this.threeRenderer.render(this.threeScene, this.threeCamera);

    // 重置 WebGL 状态，以避免影响 Cesium 后续的渲染
    context.reset();
  }

  // 同步 Three.js 相机与 Cesium 相机
  updateCamera() {
    const cesiumCamera = this.viewer.camera;
    const width = this.viewer.canvas.clientWidth;
    const height = this.viewer.canvas.clientHeight;

    // 更新投影矩阵
    this.threeCamera.aspect = width / height;
    this.threeCamera.fov = Cesium.Math.toDegrees(cesiumCamera.frustum.fovy);
    this.threeCamera.near = cesiumCamera.frustum.near;
    this.threeCamera.far = cesiumCamera.frustum.far;
    this.threeCamera.updateProjectionMatrix();

    // 获取 Cesium 相机的位置和方向
    const position = cesiumCamera.positionWC;
    const direction = cesiumCamera.directionWC;
    const up = cesiumCamera.upWC;

    // 更新缓存的向量
    this.threePosition.set(position.x, position.y, position.z);
    this.threeTarget.set(
      position.x + direction.x,
      position.y + direction.y,
      position.z + direction.z
    );
    this.threeUp.set(up.x, up.y, up.z);

    // 设置相机的位置和朝向
    this.threeCamera.position.copy(this.threePosition);
    this.threeCamera.up.copy(this.threeUp);
    this.threeCamera.lookAt(this.threeTarget);

    // 更新相机矩阵
    this.threeCamera.updateMatrixWorld();
  }

  // 必须实现的 isDestroyed 方法
  isDestroyed() {
    return false;
  }

  // 必须实现的 destroy 方法
  destroy() {
    // 释放资源
    this.threeRenderer.dispose();
    this.threeScene = null;
    this.threeCamera = null;
    return Cesium.destroyObject(this);
  }
}