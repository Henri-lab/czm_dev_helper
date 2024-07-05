// 声明一个4D向量，用于存储颜色数据
uniform vec4 color;
// 声明一个2D纹理采样器，用于获取图像数据
uniform sampler2D image;

// 获取材质函数，这是Cesium中的标准函数模板
czm_material czm_getMaterial(czm_materialInput materialInput) {
    // 获取默认材质
    czm_material material = czm_getDefaultMaterial(materialInput/*传不传无所谓?*/);
    // 获取材质输入的纹理坐标
    vec2 st = materialInput.st;
    // 从纹理中采样颜色
    vec4 colorImage = texture2D(image, vec2(st));
    // 设置材质的不透明度，结合纹理的alpha值和uniform的alpha值 
    material.alpha = colorImage.a * color.a;
    // 设置材质的漫反射颜色，并放大1.5倍
    material.diffuse = 1.5 * color.rgb;
    // 返回材质
    return material;
}
// 视觉效果
// 基础图像纹理:
// 该着色器从image纹理中采样颜色，因此基础效果会是该图像的原始颜色。

// 不透明度处理:
// 最终材质的不透明度(material.alpha)是colorImage.a（即图像的alpha通道）与color.a（uniform定义的alpha值）相乘的结果。
// 如果color.a为1.0，则不透明度完全取决于图像纹理的alpha通道。
// 如果color.a小于1.0，则不透明度会降低，呈现出一定程度的透明效果。

// 颜色处理:
// 最终材质的漫反射颜色(material.diffuse)是color.rgb（uniform定义的RGB值）放大1.5倍。
// 这意味着颜色会变得更加亮（如果color.rgb值在[0.0, 1.0]范围内），但也可能会导致颜色值超过1.0，需注意可能的颜色溢出。
// color.rgb的值决定了最终颜色的色调。如果color.rgb为白色(1.0, 1.0, 1.0)，则会保持图像颜色的原始色调并增加亮度。
// 如果color.rgb为其他颜色，例如红色(1.0, 0.0, 0.0)，则最终图像会被染成红色调，并增加亮度。
// ------------------------------------------------------------------------------------------------------
// czm_getDefaultMaterial 可能类似于以下实现

// czm_material czm_getDefaultMaterial(czm_materialInput materialInput) {
//     czm_material material;
//     material.diffuse = vec3(1.0); // 默认漫反射颜色为白色
//     material.specular = vec3(0.0); // 默认无高光反射
//     material.alpha = 1.0; // 默认完全不透明
//     material.emission = vec3(0.0); // 默认无发光
//     // 其他属性设置...

//     return material;
// }
