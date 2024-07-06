import MaterialCreator from "../../Creator/MaterialCreator";
import TextureCreator from "../../Creator/TextureCreator";

import { circleMapping_glsl, wallMapping_glsl } from "../../Effect";

const mC = new MaterialCreator();
const tC = new TextureCreator();


// 常用材质 - ConeGlowBottomCircle
add_ConeGlowBottomCircle(color) {
    const type = 'ConeGlowBottomCircle',
        texture = tC.gradientTexture({}),
        shaderSource = circleMapping_glsl;
    mC.add_CustomMaterial(type, {
        type,
        color,
        image: texture,
        source: shaderSource,
    })
}
// 常用材质 - wallGradients
add_wallMaterial(color) {
    const type = "WallGradients",
        texture = "/src/assets/materialResources/wallgradients.png",
        shaderSource = wallMapping_glsl;
    mC.add_CustomMaterial(type, {
        type,
        color,
        image: texture,
        source: shaderSource,
    })
}