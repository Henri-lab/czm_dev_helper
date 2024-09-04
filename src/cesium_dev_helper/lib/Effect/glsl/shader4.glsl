
// 这个着色器动态地根据时间和选项从纹理中采样颜色，
// 适合用于需要在 Cesium 中根据时间动态处理纹理采样的场景。
uniform sampler2D image;  // 外部传入的纹理
uniform vec3 color;       // 外部传入的颜色，包括 RGB 分量
uniform float time;       // 外部传入的时间变量

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput); // 获取默认材质

    vec2 st = materialInput.st; // 获取当前像素的纹理坐标

    // 检查纹理左上角像素的透明度，如果为完全不透明（alpha = 1.0），则丢弃该像素
    if(texture(image, vec2(0.0, 0.0)).a == 1.0) {
        discard;
    } else {
        // 计算动态透明度，根据时间和纹理坐标进行计算
        material.alpha = texture(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;
    }

    // 计算材质的漫反射颜色，根据颜色和动态透明度进行调整
    material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);

    return material; // 返回最终的材质对象
}

// 对于 Cesium 中的着色器，通常没有内置的时间变量。
