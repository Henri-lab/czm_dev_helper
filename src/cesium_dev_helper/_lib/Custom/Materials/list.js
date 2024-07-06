import MaterialCreator from "../../Creator/MaterialCreator";
import TextureCreator from "../../Creator/TextureCreator";

import { glsl_circleMapping, glsl_wallMapping } from "../../Effect";

const mC = new MaterialCreator();
const tC = new TextureCreator();


// 常用材质 - ConeGlowBottomCircle
function add_ConeGlowBottomCircle(color) {
    const type = 'ConeGlowBottomCircle',
        texture = tC.gradientTexture({}),
        source = glsl_circleMapping;
    mC.add_CustomMaterial(type, {
        type,
        color,
        image: texture,
        source,
    })
}
// 常用材质 - wallGradients
function add_wallMaterial(color) {
    const type = "WallGradients",
        texture = "url?",
        source = glsl_wallMapping;
    mC.add_CustomMaterial(type, {
        type,
        color,
        image: texture,
        source,
    })
}

export {
    add_ConeGlowBottomCircle,
    add_wallMaterial,
}