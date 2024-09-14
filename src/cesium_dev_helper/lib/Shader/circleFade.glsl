// 在屏幕中心形成一个随时间变化的圆形区域，
// 圆形区域内的像素根据距离中心的距离来调整透明度，区域外的像素被丢弃（discard）。

uniform float time;
uniform vec3 color;

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = 1.5 * color.rgb;
    vec2 st = materialInput.st;
    float dis = distance(st, vec2(0.5, 0.5));
    float per = fract(time);
    if(dis > per * 0.5) {                        
                          //material.alpha = 0.0;                        
        discard;
    } else {
        material.alpha = color.a * dis / per / 2.0;
    }
    return material;
}

// 变量说明
// float time;: 传递的时间变量，用于计算动画效果。
// czm_material czm_getMaterial(czm_materialInput materialInput): 获取材质的方法。
// materialInput.st: 纹理坐标。
// vec2 st = materialInput.st;: 当前像素的纹理坐标。
// float dis = distance(st, vec2(0.5, 0.5));: 计算当前像素到屏幕中心 (0.5, 0.5) 的距离。
// float per = fract(time);: 获取时间的小数部分，形成周期性变化。
// if(dis > per * 0.5) { discard; }: 如果距离大于当前周期范围的一半，则丢弃该像素。
// material.alpha = color.a * dis / per / 2.0;: 否则，根据距离和周期范围调整透明度。

// 视觉效果
// 中心圆形区域: 以屏幕中心为圆心，形成一个随时间变化的圆形区域。
// 透明度渐变: 圆形区域内的像素，根据距离圆心的距离和时间周期调整透明度。距离越远，透明度越高。
// 逐渐扩展和收缩: 随时间变化，圆形区域会不断扩展和收缩，形成动画效果。
// 区域外像素被丢弃: 圆形区域外的像素被丢弃（discard），使得区域外完全透明。