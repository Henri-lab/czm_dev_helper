import EffectController from "./EffectController";
import TextureCreator from "../Creator/TextureCreator";
import { CoordTransformer } from '../Compute';
import { RippleCircles, BlinkCircle, singleRippleCircle } from '../Editor/pencil/entities/advanced'


import { collapse } from './transform/collapse'

export {
    EffectController,
    TextureCreator,
    CoordTransformer,
    RippleCircles,
    BlinkCircle,
    singleRippleCircle,
    collapse,
}


// 在 Cesium 的着色器开发中，czm_material 是一个用于描述材质属性的结构体。
// 这个结构体通常包含了用于渲染的各种属性:

// 常见的 czm_material 属性
// diffuse:

// 描述：材质的漫反射颜色。
// 类型：vec3 或 vec4，表示RGB颜色。
// 示例：material.diffuse = vec3(1.0, 0.0, 0.0);（红色）。
// specular:

// 描述：材质的镜面高光颜色。
// 类型：vec3 或 vec4，通常包含光照反射的高光部分。
// 示例：material.specular = vec3(1.0, 1.0, 1.0);（白色）。
// ambient:

// 描述：材质的环境光颜色。
// 类型：vec3 或 vec4，表示材质在环境光照下的表现。
// 示例：material.ambient = vec3(0.2, 0.2, 0.2);（浅灰色）。
// emission:

// 描述：材质的自发光颜色。
// 类型：vec3 或 vec4，表示材质本身发出的光。
// 示例：material.emission = vec3(0.0, 0.0, 1.0);（蓝色）。
// alpha:

// 描述：材质的透明度。
// 类型：float，通常在0到1之间，0表示完全透明，1表示完全不透明。
// 示例：material.alpha = 0.5;（半透明）。
// shininess:

// 描述：材质的高光反射度。
// 类型：float，通常用于控制镜面高光的范围和亮度。
// 示例：material.shininess = 32.0;。
// normal:

// 描述：法线贴图，用于表现表面细节和光照效果。
// 类型：sampler2D，纹理对象。
// 示例：material.normal = sampler2D(normalTexture);。
// ambientOcclusion:

// 描述：环境遮蔽贴图，用于模拟光在不同表面接触面上的遮蔽效果。
// 类型：sampler2D，纹理对象。
// 示例：material.ambientOcclusion = sampler2D(ambientOcclusionTexture);。

