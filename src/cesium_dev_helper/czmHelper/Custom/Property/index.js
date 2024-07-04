import ConeGlowBottomCircleMaterialProperty from "./ConeGlowBottomCircleMaterialProperty";
import CustomMaterialProperty from "./CustomMaterialProperty";
import WallGradientsMaterialProperty from "./WallGradientsMaterialProperty";

export {
    ConeGlowBottomCircleMaterialProperty,
    CustomMaterialProperty,
    WallGradientsMaterialProperty,
}



// 在 Cesium 中，每个 Property 对象都应该实现以下属性和方法，以符合 Cesium 的设计模式和使用需求：

// isConstant：一个布尔属性，指示属性值是否恒定不变。

// definitionChanged：一个事件，通知监听器属性定义发生了变化。

// getType(time)：一个方法，返回属性的类型。类型通常是一个字符串，用于标识 Material 的类型。

// getValue(time, result)：一个方法，根据时间返回属性的值。result 是一个可选的对象，用于存储结果，以减少对象分配。

// equals(other)：一个方法，用于比较两个属性是否相等。



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
