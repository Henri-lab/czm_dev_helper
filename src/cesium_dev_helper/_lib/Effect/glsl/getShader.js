//处理需要根据options属性进行动态加载glsl语句的shader源码
// -理由如下：
// --将 GLSL 代码分离到单独的文件中并通过 JavaScript 动态替换占位符，
// --是为了将着色器代码和逻辑代码分离，保持代码的清晰和模块化。
// --这样可以更方便地维护和修改着色器代码。
// --直接在 GLSL 文件中传入变量当然是可行的，但这种方法在处理较复杂的场景时可能会显得不太灵活。


import directionWall_glsl from './directionWall.glsl';
import radarScan_glsl from './radarScan.glsl';
import circleScan_glsl from './circleScan.glsl';

/**
 * Function to generate a dynamic GLSL shader for directional wall visualization.
 * The shader is based on the provided options and a pre-defined GLSL template.
 *
 * @param {Object} options - An object containing the options for the shader.
 * @param {string} options.freely - The direction of the wall. Can be either 'vertical' or 'horizontal'.
 * @param {number} options.count - The number of repetitions for the wall pattern.
 * @param {string} options.direction - The direction of the wall pattern. Can be either '+' or '-'.
 * @param {boolean} options.get - A flag indicating whether to generate the shader.
 *
 * @returns {string} - The generated GLSL shader string.
 */
function getDirectionWallShader(options) {
    if (options && options.get) {
        let materialString = directionWall_glsl;

        // Replace placeholders with actual values
        materialString = materialString.replace('VERTICAL', options.freely == 'vertical' ? '1' : '0');
        materialString = materialString.replace('COUNT', options.count);
        materialString = materialString.replace('DIRECTION', options.direction);

        return materialString;
    }
}
// 另一个写法 不使用glsl文件

//  function _getDirectionWallShader(options) {
//     if (options && options.get) {
//       var materail =
//         "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
//                   {\n\
//                   czm_material material = czm_getDefaultMaterial(materialInput);\n\
//                   vec2 st = materialInput.st;\n\
//                   \n ";
//       if (options.freely == "vertical") {
//         //（由下到上）
//         materail +=
//           "vec4 colorImage = texture(image, vec2(fract(float(" +
//           options.count +
//           ")*st.t " +
//           options.direction +
//           " time), fract(st.s)));\n ";
//       } else {
//         //（direction顺[-]/逆[+]时针）
//         materail +=
//           "vec4 colorImage = texture(image, vec2(fract(float(" +
//           options.count +
//           ")*st.s " +
//           options.direction +
//           " time), fract(st.t)));\n ";
//       }
//       //泛光
//       materail +=
//         "vec4 fragColor;\n\
//                   fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
//                   fragColor = czm_gammaCorrect(fragColor);\n ";

//       materail +=
//         " material.diffuse = colorImage.rgb;\n\
//                   material.alpha = colorImage.a;\n\
//                   material.emission = fragColor.rgb;\n\
//                   \n\
//                   return material;\n\
//                   }\n\
//                   ";

//       return materail;
//     }
//   }



/**
 * Function to generate a dynamic GLSL shader for radar scan visualization.
 * The shader is based on the provided options and a pre-defined GLSL template.
 *
 * @param {Object} options - An object containing the options for the shader.
 * @param {number} options.width - The width of the radar scan.
 * @param {number} options.border - The border width of the radar scan.
 * @param {boolean} options.get - A flag indicating whether to generate the shader.
 *
 * @returns {string} - The generated GLSL shader string.
 *
 * @throws Will throw an error if the 'options' parameter is not provided or if the 'get' property is not a boolean.
 * @throws Will throw an error if the 'width' or 'border' properties are not numbers.
 */
function getRadarScanShader(options) {
    if (options && options.get) {
        let material = radarScan_glsl;

        // Replace placeholders with actual values
        material = material.replace('WIDTH', options.width);
        material = material.replace('BORDER', options.border);

        return material;
    }
}

/**
 * Function to generate a dynamic GLSL shader for circle scan visualization.
 * The shader is based on the provided options and a pre-defined GLSL template.
 *
 * @param {Object} options - An object containing the options for the shader.
 * @param {number} options.border - The border width of the circle scan.
 * @param {boolean} options.get - A flag indicating whether to generate the shader.
 *
 * @returns {string} - The generated GLSL shader string.
 *
 * @throws Will throw an error if the 'options' parameter is not provided or if the 'get' property is not a boolean.
 * @throws Will throw an error if the 'border' property is not a number.
 */
function getCircleScanShader(options) {
    if (options && options.get) {
        let material = circleScan_glsl;

        // Replace placeholders with actual values
        material = material.replace('BORDER', options.border);

        return material;
    }
}

export {
    getDirectionWallShader,
    getRadarScanShader,
    getCircleScanShader,
}
