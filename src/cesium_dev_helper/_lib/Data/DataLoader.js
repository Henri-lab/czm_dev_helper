import * as Cesium from "cesium";
import { typeOf } from "../util/type";


// 本类调用者应习惯将回调cb放在options中 而不是通常的另起一个参数
class DataLoader {
    constructor(viewer) {
        this.viewer = viewer;
        this.cache = new Map(); // 缓存机制
    }

    /**
     * Private method to listen for tile load progress and call a progress callback.
     *
     * @private
     * @param {Cesium.Cesium3DTileset} tileset - The 3D tileset to listen for progress events.
     * @param {function} progressCallback - A callback function to be called with progress information.
     *
     * @returns {undefined}
     */
    async _check3DTilesetLoadProgress(tileset, progressCallback) {
        let totalTiles = 0;
        let loadedTiles = 0;

        // Event listener for when a tile is requested
        tileset.tileLoadProgress.addEventListener(function (event) {
            totalTiles = event.total; // Total tiles to be loaded
            loadedTiles = event.current; // Tiles currently loaded

            if (progressCallback) {
                const progress = loadedTiles / totalTiles;
                progressCallback(progress);
            }
        });

        // Event listener for when all tiles have finished loading
        tileset.allTilesLoaded.addEventListener(function () {
            if (progressCallback) {
                progressCallback(1); // Loading complete
            }
        });
    }

    /**
      * Private method to listen for model load progress and call a progress callback.
      *
      * @private
      * @param {Cesium.Model} model - The model to listen for progress events.
      * @param {function} progressCallback - A callback function to be called with progress information.
      *
      * @returns {undefined}
      */
    async _checkModelLoadingProgress(model, progressCallback) {
        if (model.ready) {
            // Model is fully loaded
            if (progressCallback) {
                progressCallback(1); // 100% loaded
            }
            return; //递归结束
        }

        const stats = model._resource.fetchImage().then(() => {
            const loadedBytes = model._resource.getBytesLoaded();
            const totalBytes = model._resource.getTotalBytes();
            const progress = loadedBytes / totalBytes;

            if (progressCallback && loadedBytes !== previousLoadedBytes) {
                previousLoadedBytes = loadedBytes;
                progressCallback(progress);
            }

            // 递归循环监听
            // Continue checking the loading progress
            setTimeout(_checkModelLoadingProgress(model, progressCallback), 100);
        });
    }

    /**
     * Private method to load data with progress feedback.
     *
     * @private
     * @param {string} url - The URL of the data to load.
     * @param {string} type - The type of the data to load.
     * @param {object} [options] - Additional options for loading the data.
     * @param {function} [options.onSuccess] - A callback function to be executed when the data is successfully loaded.
     * @param {function} [options.onError] - A callback function to be executed if an error occurs during the loading process.
     * @param {function} [options.onProgress] - A callback function to be executed to provide progress information during the loading process.
     * @param {object} [options.headers] - Additional headers to be sent with the request.
     * @param {string} [options.overrideMimeType] - A MIME type to override the default MIME type for the request.
     *
     * @returns {Promise<Cesium.DataSource|Cesium.Cesium3DTileset>} A promise that resolves to the loaded data source or 3DTileset;
     * */
    async _loadDataWithProgress(url, type, options = {}) {
        // 检查缓存
        if (this.cache.has(url)) {
            const cachedData = this.cache.get(url);
            if (options.onSuccess) options.onSuccess(cachedData);
            return cachedData;
        }
        let loaded;

        try {
            let data;
            // 非3dmodel
            if (!type.toLowerCase() === '3dtiles' || !type.toLowerCase() === 'gltf') {
                const response = await xhr;
                data = await response.json();
            }

            switch (type.toLowerCase()) {
                case 'geojson':
                    loaded = await Cesium.GeoJsonDataSource.load(data, options);
                    break;
                case 'kml':
                    loaded = await Cesium.KmlDataSource.load(data, options);
                    break;
                case 'czml':
                    loaded = await Cesium.CzmlDataSource.load(data, options);
                    break;
                case '3dtiles':
                    // 新版api: Cesium.Cesium3DTileset.fromUrl(url, options);
                    loaded = await new Cesium.Cesium3DTileset({ url, options });
                    break;
                case 'gltf':
                    loaded = await Cesium.Model.fromGltf({ url, ...options });
                    break;
                case 'gpx':
                    loaded = await Cesium.GpxDataSource.load(data, options);
                    break;
                // case 'topojson':
                // TopoJSON 不支持??
                // loaded = await Cesium.TopoJsonDataSource.load(data, options);
                // break;
                default:
                    throw new TypeError(`Unsupported data type: ${type}`);
            }

            // 🚨
            // 不能将3dtiles放到dataSource里面:dataSource会被时钟监听,而model即primitive不受时钟控制
            if (!type.toLowerCase() === '3dtiles' || !type.toLowerCase() === 'gltf')
                this.viewer.dataSources.add(loaded/* 此时仅仅是datasource*/);

            // 添加到缓存
            this.cache.set(url, loaded);

            // 回掉加载对象
            if (options.onSuccess) options.onSuccess(loaded);
        } catch (error) {
            // 回掉加载错误
            if (options.onError) options.onError(error);
            else console.error(`DataLoader loading ${type}:`, error);
        }

        // 监听3d元素的加载进度  回调出加载进度 3d元素都要readyPeomise 有点烦💢
        // if (type === '3dtiles' && loaded) {
        //     loaded.readyPromise.then(final => {
        //         this._check3DTilesetLoadProgress(final, options.onProgress);
        //     })
        // }
        if (type === 'gltf' && loaded) {
            loaded.readyPromise.then(final => {
                this._checkModelLoadingProgress(final, options.onProgress);
            })
        }

        return loaded;
    }

    /**
     * Generic function to load a resource into the Cesium viewer.
     *
     * @param {Object|Array} opt - Objects containing the URL and options for each resource.
     * @param {string} opt.url - The URL of the resource to load.
     * @param {string} type - The type of resource to load ('3dtiles' or 'gltf').
     * @param {Object} [opt.headers] - Additional headers to be sent with the request.
     * @param {string} [opt.overrideMimeType] - A MIME type to override the default MIME type for the request.
     * @param {function} [opt.onSuccess] - A callback function to be executed when the resource is successfully loaded.
     * @param {function} [opt.onError] - A callback function to be executed if an error occurs during the loading process.
     * @param {function} [opt.onProgress] - A callback function to be executed to provide progress information during the loading process.
     *
     * @returns {Promise<any|Array<Promise<any>>>} 
     * A promise that resolves to the loaded resource(s). If multiple URLs are provided, it returns an array of promises.
     *
     * @throws {Error} If the provided URL is not a string or if the provided options are not an object.
     */
    // 3D Tiles and GLTF are both used in 3D graphics and GIS applications, 
    // but they serve different purposes and have different structures. 
    // they can't be simply categorized under the same "model" concept.
    async load3D(opt, type) {//将扁平的opt分为url和options两个部分🎃
        // Ensure opt has three properties that can return data
        let _finalOpt = {
            onSuccess: () => { },
            onError: () => { },
            onProgress: () => { }
        };
        Object.assign(_finalOpt, opt);

        // Parse parameters
        let __finalOptCopy = _finalOpt; // Cache to prevent data loss
        let _url = _finalOpt.url;
        delete _finalOpt.url;

        // Load a single URL
        if (!Array.isArray(opt) && typeOf(_url) === "String" && typeOf(_finalOpt) === "Object") {
            // Data loaded will be passed back on _finalOpt's three 'on' properties
            const res = await this._loadDataWithProgress(_url, type, _finalOpt);
            // 加载3dtiles的时候要使用readyPromise 

            if (type === '3dtiles' && res) {
                const _3dtile = res;
                // const _3dtile = await res.readyPromise
                // 💥💥💥有点疑惑这里返回res 或者  res.readyPromise ,
                // 调用者拿到返回值都要在readyPromise后才能拿到tile💥💥💥

                // console.log('3d tileset loaded successfully');

                // Data loaded is bound to the passed-in opt.onSuccess callback
                Object.assign(opt, _finalOpt);

                return _3dtile;
            } else if (type === 'gltf') {
                const _gltf = await res.readyPromise
                
                // console.log('GLTF loaded successfully');

                // Data loaded is bound to the passed-in opt.onSuccess callback
                Object.assign(opt, _finalOpt);

                return _gltf;
            }

        }
        // Load multiple URLs
        else if (Array.isArray(opt)) {
            let _opts = opt;
            return Promise.all(_opts.map(opt => this.load3D(opt, type)));
        }
    }

    /**
     * Function to load multiple 3D tilesets into the Cesium viewer.
     *
     * @param {Object|Array} opt - Objects containing the URL and options for each 3D tileset.
     * @returns {Promise<Cesium.Cesium3DTileset|Array<Promise<Cesium.Cesium3DTileset>>>} 
     * A promise that resolves to the loaded 3D tileset(s). If multiple URLs are provided, it returns an array of promises.
     */
    async load3DTiles(opt) {
        return await this.load3D(opt, '3dtiles');
    }

    /**
     * Function to load a GLTF model into the Cesium viewer.
     *
     * @param {Object|Array} opt - Objects containing the URL and options for each GLTF model.
     * @returns {Promise<Cesium.Model|Array<Promise<Cesium.Model>>>} 
     * A promise that resolves to the loaded GLTF model(s). If multiple URLs are provided, it returns an array of promises.
     */
    async loadGLTF(opt) {
        return await this.load3D(opt, 'gltf');
    }

    async loadGeoJSON(url, options = {}) {
        return this._loadDataWithProgress(url, 'geojson', options);
    }

    async loadKML(url, options = {}) {
        return this._loadDataWithProgress(url, 'kml', options);
    }

    async loadCZML(url, options = {}) {
        return this._loadDataWithProgress(url, 'czml', options);
    }

    async loadGPX(url, options = {}) {
        return this._loadDataWithProgress(url, 'gpx', options);
    }

    async loadTopoJSON(url, options = {}) {
        return this._loadDataWithProgress(url, 'topojson', options);
    }



    /**
     * Load data of a specific type into the Cesium viewer.
     *
     * @param {string} url - The URL of the data to load.
     * @param {string} type - The type of the data to load. Supported types are: 'geojson', 'kml', 'czml', '3dtiles', 'gpx', 'topojson'.
     * @param {object} [options] - Additional options for loading the data.
     * @param {function} [options.onSuccess] - A callback function to be executed when the data is successfully loaded.
     * @param {function} [options.onError] - A callback function to be executed if an error occurs during the loading process.
     * @param {function} [options.onProgress] - A callback function to be executed to provide progress information during the loading process.
     * @param {object} [options.headers] - Additional headers to be sent with the request.
     * @param {string} [options.overrideMimeType] - A MIME type to override the default MIME type for the request.
     *
     * @returns {Promise<Cesium.DataSource} A promise that resolves to the loaded data source
     *
     * @throws {Error} If an unsupported data type is specified.
     */
    async loadData(url, type, options = {}) {
        switch (type.toLowerCase()) {
            case 'geojson':
                return this.loadGeoJSON(url, options);
            case 'kml':
                return this.loadKML(url, options);
            case 'czml':
                return this.loadCZML(url, options);
            case 'gpx':
                return this.loadGPX(url, options);
            case '3dtiles':
                return this.load3DTiles(url, options);
            case 'gltf':
                return this.loadGLTF(url, options);
            // case 'topojson':
            //     return this.loadTopoJSON(url, options);
            default:
                throw new TypeError(`Unsupported data source type: ${type}`);
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

export default DataLoader;

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// GLTF (GL Transmission Format)--小模型
// Purpose: GLTF is a file format for transmitting 3D models, including geometry, textures, and animations. It's designed to be efficient and easy to use, making it suitable for transmitting 3D models over the web.
// Structure: A GLTF file contains a description of a 3D model, including its meshes, materials, textures, and animations. It can be thought of as a complete representation of a single 3D object or a small collection of objects.
// Usage: GLTF is commonly used for individual models, such as characters, objects, or small scenes. It's widely supported in various 3D applications and libraries, including Cesium, Babylon.js, and three.js.
// Loading in Cesium: In Cesium, GLTF models are loaded using Cesium.Model.fromGltf.

// 3D Tiles--大场面
// Purpose: 3D Tiles is an open specification for streaming massive heterogeneous 3D geospatial datasets. It enables efficient streaming and visualization of large-scale 3D data, such as city models, terrain, point clouds, and building interiors.
// Structure: A 3D Tiles dataset is a spatial hierarchy of tiles, where each tile can contain different types of 3D content (e.g., batched 3D models, point clouds, vector data). The tiles are organized in a quadtree or octree structure to support efficient level-of-detail (LOD) streaming and rendering.
// Usage: 3D Tiles is used for large-scale geospatial datasets, enabling applications like virtual city models, global terrain visualization, and dynamic point cloud rendering. It is designed to handle datasets that are too large to be loaded into memory all at once.
// Loading in Cesium: In Cesium, 3D Tiles datasets are loaded using Cesium.Cesium3DTileset.

// Why They Can't Be Categorized Under the Same "Model" Concept--
// Different Use Cases: GLTF is used for individual models or small scenes, while 3D Tiles is designed for large-scale, tiled geospatial datasets.
// Different Structures: GLTF is a single file (or a small set of files) representing a model, while 3D Tiles is a hierarchical structure of tiles that can contain various types of 3D content.
// Different Loading Mechanisms: Cesium provides different classes and methods for loading GLTF models (Cesium.Model) and 3D Tilesets (Cesium.Cesium3DTileset) because they are fundamentally different in how they are structured and used.

// Summary--
// While both GLTF and 3D Tiles can represent 3D content,
// their purposes, structures, and use cases are different enough that they cannot be simply categorized under the same "model" concept. Instead, they are complementary technologies that serve different needs in the realm of 3D graphics and geospatial visualization.
// In Cesium, they are handled by different classes and have different loading and rendering mechanisms to accommodate their unique characteristics.



// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 在 CesiumJS 中，Cesium3DTileset 和 Cesium3DTile 是用于处理 3D Tiles 数据的两个重要概念。它们分别代表整个 3D Tiles 集合和集合中的单个 3D Tile。

// Cesium3DTileset💥
// Cesium3DTileset 代表一个完整的 3D Tiles 集合。它通常包含一个或多个 3D Tiles 文件，这些文件定义了模型、点云、矢量数据等。Cesium3DTileset 负责管理这些文件的加载和渲染。

// 主要属性和方法存💦
// url: 用于加载 3D Tileset 的 URL。
// show: 控制 Tileset 是否可见。
// style: 用于应用样式到 Tileset 的 Cesium3DTileStyle 对象。
// readyPromise: 一个 Promise，在 Tileset 准备好后解析。
// boundingVolume: Tileset 的包围体。
// maximumScreenSpaceError: 控制 Tileset 的细节层次(LODs)。
// tileVisible: 在 Tile 可见时触发的事件。


// Cesium3DTile💥
// Cesium3DTile 代表 Cesium3DTileset 中的单个 Tile。每个 Tile 包含几何数据和元数据，并且可以包含子 Tile。Cesium 通过分层次 (LOD) 加载和渲染这些 Tile，以提供更好的性能和可视化效果。

// 主要属性和方法💦
// boundingVolume: Tile 的包围体。
// content: Tile 的内容，可以是几何体、点云等。
// geometricError: 控制 Tile 的几何误差。
// children: 子 Tile 的数组。
// visible: 控制 Tile 是否可见。
// Cesium3DTile 通常不直接实例化，而是通过 Cesium3DTileset 管理和访问。



// 3D Tiles 加载和渲染流程:💥
// --初始化 Cesium Viewer: 使用 Cesium.Viewer 初始化 Cesium Viewer。
// --加载 3D Tileset: 使用 Cesium.Cesium3DTileset 加载 3D Tileset 的入口文件 tileset.json。
// --处理 Tileset 的加载完成: 使用 tileset.readyPromise 处理 Tileset 加载完成后的操作。
// --缩放到 Tileset: 使用 viewer.zoomTo(tileset) 缩放到加载的 Tileset。
// --打印根 Tile 的几何误差: 访问并打印根 Tile 的几何误差。
// --处理 Tile 可见事件: 使用 tileset.tileVisible 事件处理 Tile 可见时的操作。
// --修改样式: 使用 Cesium.Cesium3DTileStyle 修改 Tileset 的样式。

// 总结💥
// 加载 Tileset: 使用 Cesium3DTileset 加载 tileset.json 文件。这个文件定义了 Tileset 的结构和根 Tile。( Tileset.root)
// 管理 Tiles: Cesium3DTileset 管理 Cesium3DTile 的加载和渲染。它根据视图和层次细节 (LOD) 动态加载和卸载 Tile。
// 渲染: Cesium 根据 Tile 的可见性和几何误差渲染适当的 Tile。
