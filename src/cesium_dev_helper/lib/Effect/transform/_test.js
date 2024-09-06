// export function collapse(tilesets, reset, customAnimate) {
//     once && (originalPositions = tilesets.modelMatrix.clone());//once call
//     once = 0
//     if (reset) {
//         // console.log('collapse reset')
//         tilesets.modelMatrix = originalPositions
//         return
//     }

//     let animate;
//     if (!customAnimate) {
//         // 默认的动画函数
//         let animationStartTime;
//         animate = (t) => {
//             // 确保只在第一次调用时记录起始时间
//             if (!animationStartTime) {
//                 animationStartTime = t;
//             }

//             // 计算动画进度
//             const progress = (t - animationStartTime) / 1000; // 用秒为单位计算时间

//             // 创建平移和旋转的矩阵
//             const translation = Cesium.Cartesian3.fromElements(100.0 * progress, 0.0, 0.0);  // 随着时间推移平移
//             const rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45 * progress));  // 随时间增加旋转角度

//             // 将平移和旋转矩阵结合
//             const transformMatrix = Cesium.Matrix4.fromTranslationRotationScale({
//                 translation: translation,
//                 rotation: rotation,
//                 scale: new Cesium.Cartesian3(1.0, 1.0, 1.0)  // 不进行缩放
//             });

//             // 重置模型的 modelMatrix（避免累加变换）
//             tilesets.modelMatrix = Cesium.Matrix4.clone(Cesium.Matrix4.IDENTITY);

//             // 应用新的变换
//             Cesium.Matrix4.multiply(tilesets.modelMatrix, transformMatrix, tilesets.modelMatrix);

//             // 标记模型需要更新
//             tilesets._dirty = true;

//             // 请求下一帧动画
//             if (progress < 1) {
//                 requestAnimationFrame(animate);
//             }
//         }
//     }
//     else animate = customAnimate;


//     requestAnimationFrame(animate);
// }



// test
// export function collapse(tilesets, reset, customAnimate) {
//     // // 创建平移和旋转的矩阵
//     const translation = Cesium.Cartesian3.fromElements(100.0, 0.0, 0.0);  // X方向平移100米
//     const rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45));  // 绕Z轴旋转45度

//     // 将平移和旋转矩阵结合
//     const transformMatrix = Cesium.Matrix4.fromTranslationRotationScale({
//         translation: translation,
//         rotation: rotation,
//         scale: new Cesium.Cartesian3(1.0, 1.0, 1.0)  // 不进行缩放
//     });

//     // 将结果存储在一个新的矩阵中，避免修改原矩阵
//     const newModelMatrix = Cesium.Matrix4.clone(Cesium.Matrix4.IDENTITY);

//     // 应用新的变换到新矩阵
//     Cesium.Matrix4.multiply(tilesets.modelMatrix, transformMatrix, newModelMatrix);

//     // 将更新后的矩阵赋值给模型
//     tilesets.modelMatrix = newModelMatrix;
//     tilesets._dirty = true;
// }