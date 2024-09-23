// geometryToBufferGeometry函数将Cesium几何对象转换为Three.js的BufferGeometry对象。主要功能如下：
// 将Cesium几何对象的属性转换为Three.js兼容的BufferAttribute格式，并添加到结果几何体中。
// 如果存在st属性，则重命名为uv并删除原st属性。
// 若几何体包含索引，则创建索引缓冲属性并设置到结果几何体上。
// 若几何体有边界球，则复制其中心和半径至结果几何体的边界球属性中。
import * as _THREE from 'three'
export const geometryToBufferGeometry = (geometry, result, THREE = _THREE) => {//geometry ,not graphic
    if (!result) result = new THREE.BufferGeometry();
    const attributes = geometry.attributes;

    for (const name in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, name) && attributes[name]) {
            const attribute = attributes[name];
            let array = attribute.values;

            if (array instanceof Float64Array) {
                array = new Float32Array(array);
            }

            const attribute3js = new THREE.BufferAttribute(
                array,
                attribute.componentsPerAttribute,
                attribute.normalize
            );
            result.setAttribute(name, attribute3js);
        }
    }

    if (attributes.st) {
        result.attributes.uv = result.attributes.st
        result.deleteAttribute('st')
    }

    if (geometry.indices) {
        const attribute3js = new THREE.BufferAttribute(geometry.indices, 1, false)
        result.setIndex(attribute3js)
    }

    if (geometry.boundingSphere) {
        const bs = geometry.boundingSphere
        if (!result.boundingSphere) result.boundingSphere = new THREE.Sphere()
        result.boundingSphere.center.copy(bs.center)
        result.boundingSphere.radius = bs.radius
    }

    return result
}