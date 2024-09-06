let once = 1
let originalPositions
let timer
import * as Cesium from "cesium";

export function collapse(tilesets, options, reset) {
    console.log('effect:transform:collapse')
    const defaultOptions = {
        collapseHeight: -50.0,  // 模型坍塌的高度
        duration: 10000,  // 动画持续时间（毫秒）
        rotationSpeed: 0,  // 旋转速度（度/秒）
    };

    const settings = { ...defaultOptions, ...options };

    let startTime;
    const animate = (time) => {
        if (!startTime) {
            startTime = time;
        }

        const elapsed = time - startTime;
        const progress = Math.min(elapsed / settings.duration, 1.0);  // 动画进度0-1

        tilesets.root.children.forEach((tile) => {
            const heightOffset = settings.collapseHeight * progress;
            const transCenter = Cesium.Cartesian3.fromElements(0.0, 0.0, heightOffset);
            const rotRadian = settings.rotationSpeed * progress * Cesium.Math.toRadians(1);
            const rotMx = Cesium.Matrix3.fromRotationZ(rotRadian);
            const rotQuat = Cesium.Quaternion.fromRotationMatrix(rotMx);

            const scale = new Cesium.Cartesian3(1.0, 1.0, 1.0);
            const trs = new Cesium.TranslationRotationScale(transCenter, rotQuat, scale);
            const transformMatrix = Cesium.Matrix4.fromTranslationRotationScale(trs);

            // 基于现有的 tile.transform 进行变换
            const newModelMatrix = Cesium.Matrix4.clone(tile.transform);  // 保留之前的矩阵
            Cesium.Matrix4.multiply(transformMatrix, newModelMatrix, newModelMatrix);  // 累加变换

            tile.transform = newModelMatrix;
            tile._dirty = true;
        });

        // 如果动画未完成，继续下一帧
        if (progress < 1.0) {
            requestAnimationFrame(animate);
        } else {
            tilesets.root.children.forEach((tile) => {
                tile.transform = Cesium.Matrix4.IDENTITY;
                tile._dirty = true;
            });
        }
    };

    // 开始动画
    requestAnimationFrame(animate);
}

