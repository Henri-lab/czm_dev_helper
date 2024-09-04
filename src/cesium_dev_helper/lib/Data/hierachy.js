// 在Cesium中实现模型的逐级跳转功能，通常需要以下步骤：
// -加载模型层次结构：首先加载包含层次结构的3D模型。这些模型通常是以glTF或3D Tiles格式存在的。
// -设置选中事件：添加点击事件或其他触发事件，当用户点击模型时，可以获取点击位置和对象。
// -解析模型层次：根据点击的对象，解析该对象在模型中的层次位置。如果模型包含多个层级，可以通过模型的元数据或结构来解析。
// -导航到下一层级：根据解析的层次信息，导航到下一层级的模型或部分。可以隐藏当前层级的模型，仅显示下一层级的内容。

// 为了性能优化和功能全面，我们需要添加更多功能：
// -按需加载模型：仅在需要时加载模型数据，以节省内存和提高性能。
// -缓存模型数据：使用缓存技术避免重复加载相同的数据。
// -批量处理：尽可能批量处理模型数据，减少渲染和计算开销。
// -优化事件处理：减少不必要的事件监听和处理，避免性能瓶颈。
// -使用LOD（细节层次）技术：根据距离和视角切换模型的细节层次。

import { EventManager, SceneManager } from '../Manager'


let defaultHierachyCache = new Map()//管理层级模型的默认缓存




/**
 * Manages the hierarchical navigation in a Cesium scene.
 * @param {Cesium.Viewer} viewer - The Cesium viewer instance.
 * @param {Map} cache - The cache for storing hierarchical models.
 * @param {Object} levelMap - The map linking instance IDs to their next level keys.
 * @param {Object} urlMap - The map linking level keys to their corresponding URLs.
 */
async function hierarchyNavigate(viewer, cache, levelMap, urlMap) {
    const eM = new EventManager(viewer)
    // 双击跳转
    eM.onMouseDoubleClick(async (event, pickPos, pickedObj) => {
        await jumpTo(pickedObj, cache, levelMap, urlMap)
        console.log('switch model level successfully')
    })

}

async function jumpTo(picked, cache, levelMap, urlMap) {
    // 搜索模型资源
    const pickedPrimitive = picked.primitive
    const ID = picked.id
    const nextKey = getNextLevelKey(ID, levelMap)
    // ~ 🧐 Key --> Url --> Primitive
    nextKey && (async function () {
        // 获得模型
        let nextPrimitive;
        // 检查缓存中是否已有下一层级模型
        let _cache
        cache ? _cache = cache : cache = defaultHierachyCache

        if (_cache.has(nextKey)) {
            nextPrimitive = _cache.get(nextKey)
            switchTo(pickedPrimitive, nextPrimitive)
        } else {
            const nextUrl = getNextLevelUrl(nextKey, urlMap)
            const sM = new SceneManager(viewer)

            nextUrl ?
                nextPrimitive = await sM.addToScene({ url: nextUrl /*可以添加其他配置选项*/ }, '3dtilesUrl')
                : console.warn('Could not find the next level primitive url')

            if (nextPrimitive) {
                switchTo(pickedPrimitive, nextPrimitive)
                _cache.set(nextKey, nextPrimitive)
            }
        }
    })()
}

function switchTo(pickedPrimitive, nextPrimitive) {
    // 隐藏上一层级模型
    pickedPrimitive.show = false
    // 显示下一层级模型
    nextPrimitive.show = true
    // -摄像机设置
    viewer.scene.camera.flyTo({
        destination: nextPrimitive.boundingSphere.center,
        duration: 2
    })
}

function getNextLevelKey(currentKey, levelMap) {
    // 根据实例ID获取下一层级的键值
    const _levelMap = levelMap

    return _levelMap[currentKey];
}

function getNextLevelUrl(currentKey, urlMap) {
    // 根据层次键值获取下一层级的URL
    const _urlMap = urlMap

    return _urlMap[currentKey];
}
// --------------------------------------------------
export {
    defaultHierachyCache,
    hierarchyNavigate,
}
