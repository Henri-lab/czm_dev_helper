uniform sampler2D image;


czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;

    vec4 colorImage = texture(image, vec2(fract(1.0 * st.s - time), fract(st.t)));

    vec4 fragColor;
    fragColor.rgb = (colorImage.rgb + color.rgb) / 1.0;
    fragColor = czm_gammaCorrect(fragColor);
    material.diffuse = colorImage.rgb;
    material.alpha = colorImage.a;
    material.emission = fragColor.rgb;

    return material;
}
