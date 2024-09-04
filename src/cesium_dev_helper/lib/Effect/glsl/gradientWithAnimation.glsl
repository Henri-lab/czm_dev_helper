uniform vec4 color;       // 外部传入的颜色值，包括 RGB 和 alpha 通道
uniform float duration;   // 动画持续时间，用于计算动画进度

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput); // 获取默认材质

    vec2 st = materialInput.st; // 获取当前像素的纹理坐标

    // 计算当前动画进度（0 到 1 之间的值）
    float t = fract(czm_frameNumber / duration);
    t *= 1.03; // 对进度稍作调整

    // 计算透明度（alpha），使用 smoothstep 和 step 函数控制渐变
    float alpha = smoothstep(t - 0.03, t, st.s) * step(-t, -st.s);
    alpha += 0.1; // 增加一个常量偏移量，使效果更明显

    vec4 fragColor;
    fragColor.rgb = color.rgb / 0.5; // 调整颜色值的强度（这里将颜色值除以 0.5）
    fragColor = czm_gammaCorrect(fragColor); // 应用 gamma 校正

    material.diffuse = fragColor.rgb; // 设置材质的漫反射颜色
    material.alpha = alpha; // 设置材质的透明度
    material.emission = fragColor.rgb; // 设置材质的发光部分

    return material; // 返回最终的材质对象
}

// 效果说明：
// 颜色调整： fragColor.rgb = color.rgb / 0.5; 将外部传入的颜色值调整强度为原来的一半，用于调节颜色的亮度或深度。

// 透明度计算： float t = fract(czm_frameNumber / duration); 计算动画进度 t，并使用 smoothstep 和 step 函数根据 st.s（纹理坐标的横向分量）控制透明度的渐变效果。增加了一个常量偏移量 0.1，以增强透明度变化的视觉效果。

// 材质设置： 将计算得到的颜色值 fragColor.rgb 分别应用于材质的漫反射颜色 (material.diffuse) 和发光部分 (material.emission)，并设置材质的透明度 (material.alpha)。

// 这种着色器可以用于实现动态的颜色变化和透明度动画效果，适用于需要在 Cesium 中实现材质动画和渐变的场景。