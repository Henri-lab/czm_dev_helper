uniform vec4 color;  // 外部传入的颜色，包括 RGBA 分量

// 获取材质函数，这是 Cesium 中的标准函数模板
czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput); // 获取默认材质
    vec2 st = materialInput.st; // 获取当前像素的纹理坐标
    float time = fract(czm_frameNumber / 10.0); // 生成0至1循环计时器，使用帧数除以10取余数

    float isAlpha = step(0.5, time); // 判断时间是否大于0.5，返回1.0或0.0
    float dis = distance(st, vec2(0.5)); // 计算当前像素到纹理中心的距离

    material.diffuse = 1.9 * color.rgb; // 设置材质的漫反射颜色为外部传入颜色的1.9倍

    // 根据时间判断透明度的计算方式
    if (isAlpha == 1.0) {
        // 如果时间大于0.5，透明度为颜色的alpha通道乘以距离的两倍
        material.alpha = color.a * dis * 2.0;
    } else {
        // 否则透明度为颜色的alpha通道乘以距离的1.5倍
        material.alpha = color.a * dis * 1.5;
    }

    return material; // 返回处理后的材质对象
}
