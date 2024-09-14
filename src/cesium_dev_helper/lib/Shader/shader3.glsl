
//  Dynamic Texture Sampler Shader
//  This shader dynamically samples a texture based on time and direction options.

// 声明一个2D纹理采样器，用于获取图像数据
uniform sampler2D image;
// 时间变量，用于动画效果的控制
uniform float time;
uniform vec3 color;

// 获取材质函数，这是Cesium中的标准函数模板
czm_material czm_getMaterial(czm_materialInput materialInput) {
    // 获取默认材质
    czm_material material = czm_getDefaultMaterial(materialInput);
    // 获取材质输入的纹理坐标
    vec2 st = materialInput.st;

    // 声明一个变量，用于存储从纹理采样得到的颜色值
    vec4 colorImage;

    // 判断垂直方向（VERTICAL）是否为1，用于选择不同的纹理采样方式
    #if {VERTICAL} == 1 
    // 如果VERTICAL为1，则根据垂直方向采样纹理
    // 这里的replace是为了在JavaScript中动态替换着色器代码中的占位符
    // *.replace('VERTICAL', options.freely == 'vertical' ? '1' : '0');
    // 计算采样坐标，使用垂直方向的纹理坐标st.t，并添加时间和方向控制
    colorImage = texture(image, vec2(fract(float({
    COUNT }
    ) * st.t {
        DIRECTION }
    time), fract(st.s)));
    // *.replace('COUNT', options.count);  // 这里COUNT是一个整数，用于控制纹理平铺的次数
    // *.replace('DIRECTION', options.direction);  // DIRECTION是一个符号，用于控制纹理移动的方向
    #else
    // 如果VERTICAL不为1，则根据水平方向采样纹理
    colorImage = texture(image, vec2(fract(float({
    COUNT }
    ) * st.s {
        DIRECTION }
    time), fract(st.t)));
    #endif

    // 声明一个变量，用于存储片段颜色
    vec4 fragColor;
    // 计算片段颜色，这里简单地将纹理颜色和材质颜色混合
    fragColor.rgb = (colorImage.rgb + color.rgb) / 1.0;
    // 进行Gamma校正
    fragColor = czm_gammaCorrect(fragColor);

    // 设置材质的漫反射颜色
    material.diffuse = colorImage.rgb;
    // 设置材质的不透明度
    material.alpha = colorImage.a;
    // 设置材质的发射颜色
    material.emission = fragColor.rgb;

    // 返回材质
    return material;
}
