// 本模块其实就是提供了 options💫 方便调用 CustomMaterial Class

import TextureCreator from "../../Creator/TextureCreator";
import CustomMaterial from "./CustomMaterial";

import { glsl_circleMapping, glsl_wallMapping } from "../../Effect";

const tC = new TextureCreator();
const ConeGlowBottomCircle = new CustomMaterial('ConeGlowBottomCircle',{
    image: tC.gradientTexture({}),
    color,
    source: glsl_circleMapping,
});

// 常用材质 - wallGradients
function wallGradients(color) {
    const options = {
        type: "WallGradients",
        uniforms: {
            color,
            image: tC.gradientTexture({}),
        },
        source: glsl_wallMapping,
    }
    // 
    mC.addMatertial(options)

    return options//💫
}

export {
    get_ConeGlowBottomCircle,
    get_wallGradients,
}