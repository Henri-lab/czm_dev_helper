import * as Cesium from 'cesium';
import CustomMaterial from './CustomMaterial';
let time = 0;
setInterval(() => {
    time += 0.01;
}, 100);

export default new CustomMaterial(
    'Test',
    {
        author: '',
        uniforms: (opt) => ({
            color: new Cesium.Color(1.0, 0.5, 0.5, 0.8),  // RGBA color
            texture: 'path/to/texture.png',               // Texture
            time: 0.0,// Time uniform for animations
        }),
        components: (opt) => ({
            diffuse: 'color.rgb',  // Use the uniform's RGB for diffuse color
            specular: '0.5',       // Constant specular value
            normal: 'vec3(0.0, 0.0, 1.0)' // Normal vector (default facing up)
        }),
        source: (opt) =>
            `
                //thanks for the contribution ${opt.author || "henrifox"}
                czm_material czm_getMaterial(czm_materialInput materialInput){
                czm_material material = czm_getDefaultMaterial(materialInput);
                material.diffuse = color.rgb;
                material.alpha = color.a;
                return material;
                }
            `
        ,
        translucent: (opt) => opt.uniforms.color.a < 1.0,   // Translucent if alpha is less than 1.0
    },
);

