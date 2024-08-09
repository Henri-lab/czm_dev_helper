//测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
//1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
//2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
//globe.pick 稳定 但只能求交地形；
//scene.pickPosition不稳定 但可以求交地形，还可以求交除地形以外其他所有写深度的物体。
import * as Cesium from "cesium";
// 鼠标交互需要开启深度拾取

/**
 * 根据鼠标在场景中的位置获取当前的鼠标位置
 * @param {Object} scene - 场景对象
 * @param {Object} position - 鼠标在场景中的位置
 * @param {Object} noPickEntity - 不参与拾取的实体
 * @returns {Object} - 当前鼠标位置的笛卡尔坐标，如果无法确定有效位置则返回undefined
 */
export function getCurrentMousePosition(scene, position, noPickEntity, extraOption) {
    let cartesian;
    // deal extraOption is null or undefined
    const { minHeight_Entity, minHeight_noEntity } = extraOption ?? { minHeight_Entity: 0, minHeight_noEntity: -500 };
    // deal minHeights are null or undefined
    const _min = minHeight_Entity || 0;
    const _min2 = minHeight_noEntity || -500;
    // Step 1: Pick the object at the mouse position on the scene
    let pickedObject = scene.pick(position);

    // Check if scene supports pickPosition and if an object was picked
    if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {

        // Check if the picked object is not the excluded entity (noPickEntity)
        if (
            noPickEntity == null ||
            (noPickEntity &&
                pickedObject.id !== noPickEntity &&
                pickedObject.primitive !== noPickEntity)
        ) {
            // Get the exact position on the picked object
            cartesian = scene.pickPosition(position);

            // Ensure the position is defined
            if (Cesium.defined(cartesian)) {
                // Convert the Cartesian position to Cartographic to get height
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                let height = cartographic.height; // Model's height

                // Return position if the height is above ground level
                if (height >= _min) return cartesian;

                // If it's not an entity (like 3D tiles) and height is within a valid range, return the position
                if (!Cesium.defined(pickedObject.id) && height >= _min2) return cartesian;
            }
        }
    }

    // If the above conditions do not provide a valid position, proceed with alternative methods

    // Step 2: Handle SceneMode-specific picking logic
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
        // 3D mode: Use a pick ray from the camera to the globe
        let pickRay = scene.camera.getPickRay(position);
        cartesian = scene.globe.pick(pickRay, scene);
    } else {
        // 2D mode: Pick the ellipsoid at the mouse position
        cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid);
    }

    // Return the Cartesian position (undefined if no valid position found)
    return cartesian;
}

// 不同场景模式下，获取当前鼠标位置的方法
// 1. SCENE3D Mode🗽
// Description:
// This is the default and most commonly used mode in Cesium, providing a fully 3D perspective of the world. It allows for interaction with the scene in a way that simulates real-world 3D space.
// Features:
// Camera Control: You can freely move the camera around in three dimensions, orbiting, panning, zooming, and tilting.
// Terrain and 3D Tiles: Supports loading and visualizing 3D terrain data, 3D tiles, models, and other objects in a realistic manner.
// Depth Picking: Objects can be picked in 3D space with depth information, enabling interactions like clicking on buildings, terrain, or other 3D objects.
// Shadows & Lighting: Supports shadows, lighting effects, and atmospheric effects that simulate real-world conditions.
// Dynamic Entities: Entities in the scene can be animated and interacted with in 3D space, including their movement and rotation.
// 2. SCENE2D Mode🗽
// Description:
// In this mode, the globe is rendered as a flat map (a 2D projection), similar to traditional map applications. It provides a top-down view of the world without perspective distortion.
// Features:
// Camera Control: The camera can pan and zoom, but there is no tilting or rotating. The view is strictly 2D, with only the x and y axes being available for movement.
// Flat Map Rendering: The globe is projected as a 2D plane, with latitude and longitude directly translating to x and y coordinates on the map.
// Simple Interaction: Object picking and interaction are simpler compared to 3D, as depth information is not considered.
// Performance: 2D mode can be more performant than 3D mode, as it doesn't require complex rendering of 3D objects, making it suitable for applications that need to display large amounts of data in a 2D map format.
// Ellipsoid Picking: In 2D mode, picking involves interacting with the 2D plane of the ellipsoid, where calculations are simpler and more direct.

// 一些说明
// 🔰
// 如果 pickedObject.id 未定义，表示当前拾取的对象可能不是一个标准的 Cesium 实体（如 Entity 对象）。在 Cesium 中，id 属性通常用于标识被拾取的对象，尤其是在使用 Entity 时。Entity 是 Cesium 中的一种高级封装，通常用于管理和渲染地理要素。
// 如果 pickedObject.id 不存在，说明这个 pickedObject 可能是其他类型的对象，比如 3D Tiles、地形数据、或者其他没有关联到具体 Entity 的图元。
// 🔰
// 对实体和 3D Tiles 应用不同的高度限制，通常是为了适应不同对象类型的几何特性和实际应用场景需求：
// 1. 实体高度限制为大于 0
// 原因:
// 实体通常是地面上的建筑物、地标、传感器、车辆等实际存在的对象，这些对象在场景中的逻辑位置通常是在地表或高于地表。因此，高度为正值（即 height > 0）可以确保拾取的点是位于地面或更高位置的实际物体。
// 目的:
// 限制实体的高度为正值是为了防止选择到地下或错误位置的实体。例如，选择一个高度为负值的位置通常不符合实体的实际物理位置，这可能导致数据错误或不可预见的结果。
// 确保实体存在于可视范围内:
// 实体通常被期望存在于用户可视范围内，并且代表的是实际的物理对象，限制高度大于 0 有助于避免拾取到无效的或意外的地下实体。
// 2. 3D Tiles 高度限制为 -500
// 原因:
// 3D Tiles 是一种更复杂的图元类型，通常用于表示大量的3D建筑、城市模型、地下结构、隧道等。尤其是在城市建模或地下场景中，3D Tiles 有时需要表示地面以下的结构（例如地下室、地铁、地下管道等）。
// 目的:
// 设置高度限制为 -500 是为了允许用户选择位于地表以下但仍在合理范围内的对象。-500 米通常足够涵盖大多数地下结构的深度，例如地下停车场、隧道、或其他工程设施。
// 支持地下场景:
// 在某些城市规划或地下建模的应用中，允许选择到地下的对象非常重要。限制高度在 -500 米以内可以确保选择到的 3D Tiles 对象仍然在用户期望的地下范围内，而不是深埋地下不可见的区域。
// 灵活性:
// 与实体相比，3D Tiles 的应用场景更加多样化，限制高度为 -500 提供了更大的灵活性，可以涵盖各种复杂场景，如地下工程或深入地下的建筑物。
// 🔰
// 获取用户点击位置对应的三维空间坐标的两种方法 对比
// 1. pickPosition🗽
// 概述:
// scene.pickPosition(windowPosition) 直接返回鼠标点击在场景中的三维空间坐标（Cartesian3）。它依赖于 WebGL 的深度缓冲区（depth buffer），可以从场景中拾取具有深度信息的所有对象的坐标，包括地形、模型、3D Tiles 等。
// 使用场景:
// 当你希望获得鼠标点击点对应的精确三维坐标，并且场景中包含复杂的 3D 对象（如地形、3D Tiles、模型等）时，pickPosition 是理想的选择。
// 适用于需要从深度缓冲区中读取位置数据的场景，这通常在有复杂场景渲染时使用。
// 优点:
// 高精度: 可以直接获取到鼠标点击位置的精确三维坐标，尤其是在处理复杂地形和模型时效果更好。
// 支持复杂对象: 可以拾取到包括地形、建筑物、3D Tiles 等在内的几乎所有对象的深度信息。
// 缺点:
// 依赖深度缓冲区: 需要开启场景的深度检测 (scene.pickPositionSupported)，如果深度检测不支持或者在某些情况下深度缓冲区没有正确填充（如在某些浏览器或设备上），pickPosition 可能返回不正确的值或失败。
// 性能开销: 由于需要读取深度缓冲区数据并转换为三维坐标，这在性能上比单纯的射线拾取稍高一些。
// 2. pickRay + scene.global.pick🗽
// 概述:
// scene.camera.getPickRay(windowPosition) 生成一条射线，然后通过 scene.globe.pick(ray, scene) 获取射线与地球椭球体或地形的交点坐标。该方法主要用于在地球表面或地形上获取鼠标点击位置的坐标。
// 使用场景:
// 当你只关心鼠标点击点在地表上的位置时，pickRay + pick 是一个更简单和直接的选择，特别是在需要获取地表位置或做简单地形交互时。
// 适用于需要射线与地形交点的场景，如在地球表面绘制路径、标记地面位置等。
// 优点:
// 性能较好: 生成射线并计算交点通常比直接从深度缓冲区读取位置快，尤其是在简单场景下。
// 地表交点精确: 适合在地球表面或地形上获取准确位置，特别是在 2D 和 3D 场景中都可以很好地工作。但是在2D中更推荐使用pickEllipsoid(专注于地球椭球体的表面)
// 缺点:
// 局限性: 只能拾取到与地表或地形的交点，无法拾取到空中或其他非地形对象（如建筑物、模型等）的坐标。
// 不支持复杂对象: 如果点击的位置在模型或 3D Tiles 上，而不是地表或地形上，pickRay + pick 可能无法返回你想要的结果。