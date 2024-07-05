uniform vec4 color;      // 外部传入的颜色，包括 RGBA 分量
uniform float duration;  // 动画持续时间
uniform float count;     // 计数
uniform float gradient;  // 渐变值，用于控制透明度的渐变

// 获取材质函数，这是 Cesium 中的标准函数模板
czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput); // 获取默认材质
    material.diffuse = 1.5 * color.rgb; // 设置材质的漫反射颜色为外部传入颜色的 1.5 倍

    vec2 st = materialInput.st;   // 获取当前像素的纹理坐标
    vec3 str = materialInput.str; // 获取当前像素的三维纹理坐标（不透明度），用于丢弃不透明的像素

    float dis = distance(st, vec2(0.5, 0.5)); // 计算当前像素到纹理中心的距离
    float per = fract(czm_frameNumber / duration); // 根据帧数和持续时间计算时间百分比

    // 根据三维纹理坐标 str.z 判断是否需要丢弃当前像素
    if(abs(str.z) > 0.001) {
        discard; // 如果不透明度大于 0.001，丢弃当前像素
    }

    // 如果当前像素距离中心超过 0.5，也丢弃当前像素
    if(dis > 0.5) {
        discard;
    } else {
        float perDis = 0.5 / count; // 计算每个区间的距离
        float disNum;
        float bl = 0.0;

        // 循环计算透明度
        for(int i = 0; i <= 10; i++) {
            if(float(i) <= count) {
                disNum = perDis * float(i) - dis + per / count; // 计算当前像素距离区间的距离
                if(disNum > 0.0) {
                    if(disNum < perDis) {
                        bl = 1.0 - disNum / perDis; // 计算透明度比例
                    } else if(disNum - perDis < perDis) {
                        bl = 1.0 - abs(1.0 - disNum / perDis); // 计算透明度比例
                    }
                    material.alpha = pow(bl, gradient); // 应用渐变效果
                }
            }
        }
    }

    return material; // 返回处理后的材质对象
}
