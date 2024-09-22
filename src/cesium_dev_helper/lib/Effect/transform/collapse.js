let once = 1
let originalPositions
let timer
import * as Cesium from "cesium";

export function collapse(tilesets, options, reset) {
    console.log('effect:transform:collapse')
    const defaultOptions = {
        collapseHeight: -0.4,  // 模型坍塌的高度
        duration: 5000,  // 动画持续时间（毫秒）
        rotationSpeed: -50,  // 旋转速度
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
            const transCenter = new Cesium.Cartesian3(0, 0, heightOffset); // 大楼底部位置
            const rotRadian = settings.rotationSpeed * progress * Cesium.Math.toRadians(1);
            const rotMx = Cesium.Matrix3.fromRotationX(rotRadian);

            const scale = new Cesium.Cartesian3(1.0, 1.0, 1.0);
            const trs = new Cesium.TranslationRotationScale(transCenter, Cesium.Quaternion.IDENTITY, scale);
            const transformMatrix = Cesium.Matrix4.fromTranslationRotationScale(trs);

            // 基于现有的 tile.transform 进行变换
            const newModelMatrix = Cesium.Matrix4.clone(tile.transform);  // 保留之前的矩阵
            // 累加变换
            // Math.random() > 0.5 ?
            //     Cesium.Matrix4.multiply(transformMatrix, newModelMatrix, newModelMatrix) :
            //     Cesium.Matrix4.setRotation(newModelMatrix, rotMx, newModelMatrix);

            Cesium.Matrix4.multiply(transformMatrix, newModelMatrix, newModelMatrix)
            
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

