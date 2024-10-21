import * as Cesium from 'cesium';
import MaterialRegister from './MaterialRegister';

let dynamicTextureMaterial = null;

let uniforms_def = {
    u_texture: 'images/texture0.jpg',
    u_time: 0.0,
},
    glsl_def = `
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
    update_def = (uniforms) => { uniforms.u_time += 0.01; }

//viewer暂时不是需要的
export const registerDynamicTexture = (type, options, viewer) => {
    const def_options = { uniforms: uniforms_def, source: glsl_def, update: update_def };
    if (!options) {
        options = def_options;
    }
    const { uniforms, source, update } = options;
    dynamicTextureMaterial = new MaterialRegister(type ? '#DynamicTexture' : `#DynamicTexture:${type}`, {
        uniforms,
        source,
        update,
    }, viewer).getMaterial();
    return dynamicTextureMaterial;
};




// options list
const getWaterOptions = ({ uniforms, glsl }) => {
    let uniforms_water_def = {
        normalMap: 'images/water.jpg',
        frequency: 100.0,	//波的数量
        animationSpeed: 0.01,	//水波震动速度
        amplitude: 10.0		//振幅大小
    }
    let glsl_water_def =
        'varying vec3 v_positionMC;\n' +
        'varying vec3 v_positionEC;\n' +
        'varying vec2 v_st;\n' +
        'void main()\n' +
        '{\n' +
        'czm_materialInput materialInput;\n' +
        'vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n' +
        '#ifdef FACE_FORWARD\n' +
        'normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n' +
        '#endif\n' +
        'materialInput.s = v_st.s;\n' +
        'materialInput.st = v_st;\n' +
        'materialInput.str = vec3(v_st, 0.0);\n' +
        'materialInput.normalEC = normalEC;\n' +
        'materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n' +
        'vec3 positionToEyeEC = -v_positionEC;\n' +
        'materialInput.positionToEyeEC = positionToEyeEC;\n' +
        'czm_material material = czm_getMaterial(materialInput);\n' +
        '#ifdef FLAT\n' +
        'gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n' +
        '#else\n' +
        'gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n' +
        'gl_FragColor.a=0.55;\n' +
        '#endif\n' +
        '}\n';
    return {
        uniforms: uniforms || uniforms_water_def,
        source: glsl || glsl_water_def,
    }
}


export const optionsHookOfDynamicTextureMaterial = {
    water: getWaterOptions
}
