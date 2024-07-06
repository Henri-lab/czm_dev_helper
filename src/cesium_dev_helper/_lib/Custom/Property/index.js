import ConeGlowBottomCircleMaterialProperty from "./ConeGlowBottomCircleMaterialProperty";
import CustomMaterialProperty from "./CustomMaterialProperty";
import WallGradientsMaterialProperty from "./WallGradientsMaterialProperty";

export {
    ConeGlowBottomCircleMaterialProperty,
    CustomMaterialProperty,
    WallGradientsMaterialProperty,
}



// 在 Cesium 中，每个 Property 对象都应该实现以下属性和方法，以符合 Cesium 的设计模式和使用需求：
// --🧐这就是Property这样处理后 cesium可以做到'动态渲染'的原理--

// isConstant：一个布尔属性，指示属性值是否恒定不变。

// definitionChanged：一个事件，通知监听器属性定义发生了变化。
//                    Cesium 渲染引擎在'每一帧'⏰渲染之前会检查'所有对象'🎃的 definitionChanged 事件。

// getType(time)：一个方法，返回属性的类型。类型通常是一个字符串，用于标识 Material 的类型。

// getValue(time, result)：一个方法，根据时间返回属性的值。result 是一个可选的对象，用于存储结果，以减少对象分配。

// equals(other)：一个方法，用于比较两个属性是否相等。


// CLASS IN ES6 --------------------------------------------------------------------------------------------------
// __________________________________________________________________________________________________________
// class MyCustomMaterialProperty {
//   constructor(options = {}) {
//     this._definitionChanged = new Cesium.Event();
//     this._color = undefined;
//     this._colorSubscription = undefined;
//     this.color = options.color;
//     this.image = options.image;
//   }

//   get isConstant() {
//     return false;
//   }

//   get definitionChanged() {
//     return this._definitionChanged;
//   }

//   getType(time) {
//     return 'MyCustomMaterial';
//   }

//   getValue(time, result) {
//     if (!Cesium.defined(result)) {
//       result = {};
//     }
//     result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
//     result.image = this.image;
//     return result;
//   }


//   set value(value) {
//         const oldValue = this._value;
//         if (oldValue !== value) {
//             this._value = value;
//             this._definitionChanged.raiseEvent(this, 'value'); //✨
//         }
//     }

//   equals(other) {
//     return this === other ||
//       (other instanceof MyCustomMaterialProperty &&
//         Cesium.Property.equals(this._color, other._color) &&
//         this.image === other.image);
//   }
// }

// // 注册自定义材质类型
// Cesium.Material._materialCache.addMaterial('MyCustomMaterial', {
//   fabric: {
//     type: 'MyCustomMaterial',
//     uniforms: {
//       color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
//       image: 'path/to/your/image.png'
//     },
//     source: `
//       czm_material czm_getMaterial(czm_materialInput materialInput)
//       {
//           czm_material material = czm_getDefaultMaterial(materialInput);
//           vec4 color = texture2D(image, materialInput.st) * color;
//           material.diffuse = color.rgb;
//           material.alpha = color.a;
//           return material;
//       }
//     `
//   },
//   translucent: function (material) {
//     return material.uniforms.color.alpha < 1.0;
//   }
// });

// // 使用自定义材质
// const viewer = new Cesium.Viewer('cesiumContainer');
// const customMaterialProperty = new MyCustomMaterialProperty({
//   color: new Cesium.Color(0.0, 1.0, 0.0, 1.0),
//   image: 'path/to/your/image.png'
// });

// const rectangle = viewer.entities.add({
//   name: 'Rectangle',
//   rectangle: {
//     coordinates: Cesium.Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0),
//     material: customMaterialProperty
//   }
// });

// viewer.zoomTo(viewer.entities);











// ---------------------------------------------------------------------------------------------------------------
// 函数工厂模式：new ConeGlowBottomCircleMaterialProperty(color);
// ___________________________________________________________________________________________________________
// export default function ConeGlowBottomCircleMaterialProperty(color) {
//     this._definitionChanged = new Cesium.Event();
//     this._color = undefined;
//     this._colorSubscription = undefined;
//     this.color = color;
// }
// Object.defineProperties(ConeGlowBottomCircleMaterialProperty.prototype, {
//     isConstant: {
//         get: function () {
//             return false;
//         }
//     },
//     definitionChanged: {
//         get: function () {
//             return this._definitionChanged;
//         }
//     },
//     // color: Cesium.createPropertyDescriptor('color') 新版api
    
// });
// ConeGlowBottomCircleMaterialProperty.prototype.getType = function (time) {
//     // Cesium 会根据 getType 方法返回的字符串来从材质缓存中取出对应的材质类型
//     return 'ConeGlowBottomCircle';
// };
// ConeGlowBottomCircleMaterialProperty.prototype.getValue = function (time, result) {
//     if (!Cesium.defined(result)) {
//         result = {};
//     }
//     result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
//     result.image = Cesium.Material.ConeGlowBottomCircleImage;
//     return result;
// };
// ConeGlowBottomCircleMaterialProperty.prototype.equals = function (other) {
//     return this === other ||
//         (other instanceof ConeGlowBottomCircleMaterialProperty &&
//             Cesium.Property.equals(this._color, other._color));
// };

// 1. definitionChanged
// definitionChanged 是一个 Cesium.Event 对象，用于监听和触发属性变化事件。
// 当属性的值发生变化时，这个事件会被触发，以通知其他相关部分进行更新。
// 它主要用于属性值是动态或可变的场景。

// 2. Cesium.createPropertyDescriptor
// Cesium.createPropertyDescriptor 是一个帮助函数，用于创建属性描述符。
// 它创建的属性具有 getter 和 setter 方法，能够在setter中自动触发 definitionChanged 事件。
// 这使得属性的变化可以被监视和响应。

// 补充:
// 在JavaScript ES6中，使用 class 语法和标准的 getter 和 setter 可以实现与 Cesium.createPropertyDescriptor 类似的功能。
// createPropertyDescriptor 的主要目的是为属性创建 getter 和 setter，并在属性值发生变化时触发事件。
// 使用 class 语法可以直接定义 getter 和 setter，同时在 setter 中触发事件。这使得代码更简洁和易读。