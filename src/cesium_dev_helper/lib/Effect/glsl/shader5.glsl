// 这个着色器通过混合纹理和自定义颜色来实现材质的定制效果，
// 并对最终的颜色进行了 gamma 矫正，
// 适合用于需要在 Cesium 中实现基于纹理的颜色混合和自定义效果的场景。


uniform sampler2D image; // 材质的纹理图像
uniform vec3 color;//混色中 添加的颜色

// 获取材质的函数，接受材质输入并返回处理后的材质
czm_material czm_getMaterial(czm_materialInput materialInput) {
    // 获取默认材质
    czm_material material = czm_getDefaultMaterial(materialInput);

    // 获取纹理坐标
    vec2 st = materialInput.st;

    // 根据时间和纹理坐标获取纹理颜色
    // 使用 fract 函数保证纹理坐标在 0 到 1 之间循环
    vec4 colorImage = texture(image, vec2(fract(1.0 * st.s - time), fract(st.t)));

    // 计算最终颜色并进行 gamma 矫正
    vec4 fragColor;
    fragColor.rgb = (colorImage.rgb + color.rgb) / 1.0; // 混合纹理颜色和自定义颜色
    fragColor = czm_gammaCorrect(fragColor); // 应用 gamma 矫正

    // 将计算得到的属性应用于材质
    material.diffuse = colorImage.rgb; // 漫反射颜色为纹理颜色
    material.alpha = colorImage.a; // 设置透明度为纹理的 alpha 通道
    material.emission = fragColor.rgb; // 发光颜色为最终颜色的 rgb 部分

    return material; // 返回处理后的材质
}

// Gamma 校正是一种在计算机图形学中常用的技术，用于调整显示设备的输出，以匹配人眼对光线强度的感知方式。
// 在实际应用中，显示设备（例如显示器）和图形处理软件通常会对颜色进行 gamma 校正，以提高图像的视觉质量和真实感。

// 人类视觉系统对光线的感知并非线性的，而是近似于对数关系。
// 因此，当计算机显示器（CRT、LCD 等）显示图像时，需要对图像的颜色进行非线性调整，以更好地匹配人眼感知的亮度。
// 在计算机图形中的应用
// 在计算机图形中，当从线性 RGB 值转换到最终显示值时，会应用 gamma 校正。这一过程涉及两个主要步骤：

// 从线性 RGB 到伽马校正 RGB：
// 将计算得到的线性 RGB 值应用 gamma 函数进行转换，以得到适合显示的颜色值。

// 从伽马校正 RGB 到最终设备空间（如 sRGB）：
// 将伽马校正的颜色值映射到最终的显示设备色彩空间（例如 sRGB），这一过程也可能涉及色彩空间的转换。

// vec3 gammaCorrect(vec3 colorLinear, float gamma) {
//     // gamma 通常在 2.2 的范围内，用于大多数标准显示设备。
//     // pow 可以 对 vector分量 作用 
//     return pow(colorLinear, vec3(1.0 / gamma));
// }