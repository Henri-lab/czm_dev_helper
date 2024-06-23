//处理需要根据options属性进行动态加载glsl语句的shader源码
// -理由如下：
// --将 GLSL 代码分离到单独的文件中并通过 JavaScript 动态替换占位符，
// --是为了将着色器代码和逻辑代码分离，保持代码的清晰和模块化。
// --这样可以更方便地维护和修改着色器代码。
// --直接在 GLSL 文件中传入变量当然是可行的，但这种方法在处理较复杂的场景时可能会显得不太灵活。


import directionWall_glsl from './directionWall.glsl';
import radarScan_glsl from './radarScan.glsl';
import circleScan_glsl from './circleScan.glsl';

function _getDirectionWallShader(options) {
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

function _getRadarScanShader(options) {
    if (options && options.get) {
        let material = radarScan_glsl;

        // Replace placeholders with actual values
        material = material.replace('WIDTH', options.width);
        material = material.replace('BORDER', options.border);

        return material;
    }
}

function _getCircleScanShader(options) {
    if (options && options.get) {
        let material = circleScan_glsl;

        // Replace placeholders with actual values
        material = material.replace('BORDER', options.border);

        return material;
    }
}
