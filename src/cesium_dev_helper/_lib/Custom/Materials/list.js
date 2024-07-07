// 本模块其实就是提供了 options💫 方便调用 add_CustomMaterial


import MaterialCreator from "../../Creator/MaterialCreator";
import TextureCreator from "../../Creator/TextureCreator";

import { glsl_circleMapping, glsl_wallMapping } from "../../Effect";

const mC = new MaterialCreator();
const tC = new TextureCreator();


// 常用材质 - ConeGlowBottomCircle
function get_ConeGlowBottomCircle(color) {
    const options = {
        type: 'ConeGlowBottomCircle',
        uniforms: {
            color,
            image: tC.gradientTexture({}),
        },
        source: glsl_circleMapping,
    }
    // 
    mC.add_CustomMaterial(options)

    return options//💫
}
// 常用材质 - wallGradients
function get_wallMaterial(color) {
    const options = {
        type: "WallGradients",
        uniforms: {
            color,
            image: "img-url",
        },
        source: glsl_wallMapping,
    }
    // 
    mC.add_CustomMaterial(options)

    return options//💫
}

export {
    get_ConeGlowBottomCircle,
    get_wallMaterial,
}