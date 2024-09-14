import * as Cesium from 'cesium';
import MaterialRegister from './MaterialRegister';

let dynamicTextureMaterial = null;
export const registerDynamicTexture = (viewer) => {
    dynamicTextureMaterial = new MaterialRegister('#DynamicTexture', {
        uniforms: {
            u_texture: 'images/texture2.jpg',
            u_time: 0.0,
        },
        source: `
            uniform sampler2D u_texture;  // The texture uniform
            uniform float u_time;  // Time uniform for animation

            czm_material czm_getMaterial(czm_materialInput materialInput) {
                czm_material material = czm_getDefaultMaterial(materialInput);
                vec2 st = materialInput.st;

                // Apply animation logic (e.g., shifting texture coordinates over time)
                st.x += sin(u_time) * 0.05;
                st.y += cos(u_time) * 0.05;

                // Fetch the color from the dynamic texture
                vec4 color = texture2D(u_texture, st);
                
                // Assign color to material
                material.diffuse = color.rgb;
                material.alpha = color.a;

                return material;
            }
        `,
        update: (uniforms) => { uniforms.u_time += 0.01; }
    }, viewer).getMaterial();
};

export const getDynamicTextureMaterial = () => dynamicTextureMaterial;
