uniform sampler2D image;

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    vec4 colorImage = texture2D(image, vec2(fract(st.t - time), st.t));
    float time = fract(czm_frameNumber / 10.0);
    float isAlpha = step(0.5, time);
    float dis = distance(st, vec2(0.5));
    if(isAlpha >= 1.0) {
        material.alpha = colorImage.a * color.a * dis * 2.5;
    } else {
        material.alpha = colorImage.a * color.a * dis * 2.0;
    }
    material.diffuse = 2.5 * color.rgb;
    return material;
}