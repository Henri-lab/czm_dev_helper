import MaterialCreator from "../../Creator/MaterialCreator";
import TextureCreator from "../../Creator/TextureCreator";

import { glsl_circleMapping, glsl_wallMapping } from "../../Effect";

const mC = new MaterialCreator();
const tC = new TextureCreator();


// 常用材质 - ConeGlowBottomCircle
function add_ConeGlowBottomCircle(color) {
    const options = {
        type: 'ConeGlowBottomCircle',
        uniforms: {
            color,
            image: tC.gradientTexture({}),
        },
        source: glsl_circleMapping,
    }
    mC.add_CustomMaterial(options)
}
// 常用材质 - wallGradients
function add_wallMaterial(color) {
    const options = {
        type: "WallGradients",
        uniforms: {
            color,
            image: "img-url",
        },
        source: glsl_wallMapping,
    }
    mC.add_CustomMaterial(options)
}

export {
    add_ConeGlowBottomCircle,
    add_wallMaterial,
}