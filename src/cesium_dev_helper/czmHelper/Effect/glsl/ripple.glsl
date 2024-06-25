// source

uniform vec4 color;

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    float time = fract(czm_frameNumber / 10.0);
    float isAlpha = step(0.5, time);
    float dis = distance(st, vec2(0.5));
    material.diffuse = 1.9 * color.rgb;
    if(isAlpha == 1.0) {
        material.alpha = color.a * dis * 2.0;
    } else {
        material.alpha = color.a * dis * 1.5;
    }
    return material;
}