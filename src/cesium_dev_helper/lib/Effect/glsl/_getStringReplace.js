//处理需要根据options属性进行动态加载glsl语句的shader源码
// -理由如下：
// --将 GLSL 代码分离到单独的文件中并通过 JavaScript 动态替换占位符，
// --是为了将着色器代码和逻辑代码分离，保持代码的清晰和模块化。
// --这样可以更方便地维护和修改着色器代码。
// --直接在 GLSL 文件中传入变量当然是可行的，但这种方法在处理较复杂的场景时可能会显得不太灵活。

// 在WebGL或其他图形API中，传递数据到着色器的常用方法有两种：使用uniform变量和字符串替换。以下是这两种方法的优缺点对比：

// 使用uniform传参
// -优点
// 高效和便捷：uniform变量是专门设计用于传递数据到着色器的机制，使用起来简便且高效。
// 类型安全：uniform变量的类型在GLSL中明确规定，传递数据时会进行类型检查，减少出错的可能。
// 动态更新：可以在渲染过程中动态更新uniform变量的值，而不需要重新编译或重新链接着色器程序。
// 代码清晰：使用uniform变量传递数据的代码通常更为简洁和易读，便于维护。
// -缺点
// 数量限制：不同的硬件和平台对uniform变量的数量有一定限制，如果需要传递大量数据可能会受到限制。
// 较小数据量：适合传递少量数据（例如矩阵、向量、浮点数等），对于大数据块（如纹理数据等）需要使用其他机制。

// 字符串替换
// -优点
// 灵活性：通过字符串替换可以直接修改着色器代码的任何部分，包括变量定义、逻辑控制等，实现高度灵活的自定义效果。
// 无数量限制：不受uniform变量数量限制，可以在着色器代码中嵌入大量数据。
// 适合常量数据：对于不需要动态更新的常量数据，通过字符串替换直接嵌入到着色器代码中是非常高效的。
// -缺点
// 效率低下：每次修改着色器代码都需要重新编译和链接着色器程序，开销较大，尤其在频繁更新数据时性能较差。
// 维护困难：着色器代码变得不易维护，嵌入的字符串可能导致代码可读性下降，调试也更加复杂。
// 安全性低：字符串替换缺乏类型检查，容易出错并且不易发现错误。
// 不适合动态数据：对于需要频繁更新的数据，字符串替换效率低下且不便。

// 实际应用中的选择

// -使用uniform变量：
// 适合动态更新的数据，例如光照参数、变换矩阵等。
// 适合较小的数据量，且在渲染过程中需要频繁更新的数据。
// 代码清晰且易于维护。

// -使用字符串替换：
// 适合静态且不常更新的数据，例如一些着色器中固定的常量或控制逻辑。
// 适合需要高灵活性的场景，能够直接修改着色器的代码逻辑。
// 适合传递大量数据的场景，但需要权衡重新编译和链接带来的开销。

// 综合来看，在大多数情况下，推荐使用uniform变量传递数据，因为其效率高且代码维护性好。
// 而字符串替换则适用于特定场景，需要谨慎使用。


// 判断一个变量是否适合作为宏定义常量可以基于以下几个标准：-------------------------------------------------------

// 值在渲染过程中不会改变：如果变量的值在整个渲染过程中始终保持不变，则可以考虑将其定义为宏常量。
// 编译时决定的值：如果变量的值在编译时就已经确定，并且不需要在运行时进行修改或更新，那么它适合作为宏常量。
// 与着色器逻辑紧密相关：一些值直接影响着色器的逻辑和控制流，例如循环次数、条件分支等，适合作为宏常量以简化代码结构和提高性能。
// 简化代码：使用宏常量可以使代码更简洁、易读，减少运行时传递数据的开销。
// 在你的着色器代码中，适合作为宏定义常量的变量是BORDER。以下是详细说明：

// BORDER 作为宏定义常量
// 用途：BORDER变量用于控制扫描效果的边界强度，是一个整数值。在着色器代码中，它被用于控制扫描效果的混合因子计算。
// 值不变：从代码中可以看出，BORDER的值在整个渲染过程中是固定的，不需要动态更新。
// 影响逻辑：BORDER直接影响混合因子的计算逻辑，通过将其定义为宏常量，可以减少传递参数的开销，并且提升代码的可读性。



// 直接拼接string - 另一个写法 不使用glsl导入技术
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
 * Replace placeholders in a string based on a map of replacements.
 * @param {string} string - The input string containing placeholders.
 * @param {Object} replaceMap - An object where keys are placeholders to replace,
 *                              and values are the replacements.
 * @example
 * // Example usage:
 * const originalString = "Hello {name}, today is {day}.";
 * const replacements = {
 *"name": "Alice",
 *"day": "Monday"
* };
*const replacedString = getStringReplaced(originalString, replacements);
*console.log(replacedString); // Output: "Hello Alice, today is Monday." 
* @returns {string} The string with placeholders replaced.
*/
export default function getStringReplaced(string, replaceMap) {
    // Regular expression pattern to match placeholders in the format '{key}'
    const pattern = /{([^}]+)}/g;

    // Replace placeholders in the string using a callback function
    const result = string.replace(pattern, (match, key) => {
        // Check if the key exists in the replaceMap
        if (replaceMap.hasOwnProperty(key)) {
            return replaceMap[key]; // Replace with the corresponding value from replaceMap
        } else {
            return match; // No replacement found, return the original placeholder
        }
    });

    return result;
}

