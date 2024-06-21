uniform vec4 color;
uniform sampler2D image;

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    vec4 colorImage = texture2D(image, vec2(st));
    material.alpha = colorImage.a * color.a;
    material.diffuse = 1.5 * color.rgb;
    return material;
}