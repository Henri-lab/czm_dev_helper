uniform sampler2D image;
float time;

/*字符串中的某些字符会根据options被替换为不同的值*/
czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;

    vec4 colorImage;

    #if VERTICAL == 1 
    // *.replace('VERTICAL', options.freely == 'vertical' ? '1' : '0');
    colorImage = texture(image, vec2(fract(float(COUNT) * st.t DIRECTION time), fract(st.s)));
    // *.replace('COUNT', options.count);
    // *.replace('DIRECTION', options.direction);
    #else
    colorImage = texture(image, vec2(fract(float(COUNT) * st.s DIRECTION time), fract(st.t)));
    #endif

    vec4 fragColor;
    fragColor.rgb = (colorImage.rgb + color.rgb) / 1.0;
    fragColor = czm_gammaCorrect(fragColor);

    material.diffuse = colorImage.rgb;
    material.alpha = colorImage.a;
    material.emission = fragColor.rgb;

    return material;
}
