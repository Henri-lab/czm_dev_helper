import * as Cesium from "cesium";
import { typeOf } from "../util/type";


// 本类调用者应习惯将回调cb放在options中 而不是通常的另起一个参数
class DataLoader {
    constructor(viewer) {
        this.viewer = viewer;
        this.cache = new Map(); // 缓存机制
    }

    // 使用 fetch 实现进度反馈的通用加载函数
    /**
     * Fetch data with progress feedback.
     * @private
     * @param {string} url - The URL to fetch.
     * @param {Object} options - Additional options including progress callbacks.
     * @returns {Promise<Response>} The fetch response.
     */
    async _fetchWithProgress(url, options) {
        const response = await fetch(url, {
            method: 'GET',
            headers: options.headers || {}
        });

        const reader = response.body.getReader();

        // 获取响应体的总长度
        const contentLength = +response.headers.get('Content-Length');
        // 初始化接收的长度和存储块的数组
        let receivedLength = 0;
        const chunks = [];

        // 持续读取响应体的块数据
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // 将读取到的块数据推入数组，并更新已接收的长度
            chunks.push(value);
            receivedLength += value.length;

            if (options.onProgress) {
                // 传递百分比到回调
                const percentComplete = (receivedLength / contentLength) * 100;
                options.onProgress(percentComplete);
            }
        }

        // 创建一个新的 Uint8Array 来存储所有的块数据
        const chunksAll = new Uint8Array(receivedLength);
        let position = 0;
        // 将所有块数据合并到一个单一的 Uint8Array 中
        for (let chunk of chunks) {
            chunksAll.set(chunk, position);
            position += chunk.length;
        }


        // 直接解析为json格式并导出
        // const jsonData = JSON.parse(new TextDecoder().decode(chunksAll));
        // return jsonData; 

        // 导出原始数据 可以在外部解析为json
        return new Response(chunksAll, { headers: response.headers });
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

        // 使用 Cesium.loadWithXhr 实现进度反馈 (已被弃用？？)
        // 使用fetch的方式计算进度
        const xhr = this._fetchWithProgress(url, options);
        // progress percent 会传入在options.onProgress

        let dataSourceOrTileset;

        try {
            let data;
            // 非3dmodel
            if (!type.toLowerCase() === '3dtiles' || !type.toLowerCase() === 'gltf') {
                const response = await xhr;
                data = await response.json();
            }

            switch (type.toLowerCase()) {
                case 'geojson':
                    dataSourceOrTileset = await Cesium.GeoJsonDataSource.load(data, options);
                    break;
                case 'kml':
                    dataSourceOrTileset = await Cesium.KmlDataSource.load(data, options);
                    break;
                case 'czml':
                    dataSourceOrTileset = await Cesium.CzmlDataSource.load(data, options);
                    break;
                case '3dtiles':
                    // 新版api: Cesium.Cesium3DTileset.fromUrl(url, options);
                    const tilesetPromise = await new Cesium.Cesium3DTileset({ url, options });
                    dataSourceOrTileset = tilesetPromise;
                    break;
                case 'gltf':
                    dataSourceOrTileset = await Cesium.Model.fromGltf({ url, ...options });
                    break;
                case 'gpx':
                    // GPX 支持
                    dataSourceOrTileset = await Cesium.GpxDataSource.load(data, options);
                    break;
                case 'topojson':
                    // TopoJSON 支持
                    dataSourceOrTileset = await Cesium.TopoJsonDataSource.load(data, options);
                    break;
                default:
                    throw new Error(`Unsupported data type: ${type}`);
            }

            this.viewer.dataSources.add(dataSourceOrTileset);

            // 添加到缓存
            this.cache.set(url, dataSourceOrTileset);

            if (options.onSuccess) options.onSuccess(dataSourceOrTileset);
        } catch (error) {
            if (options.onError) options.onError(error);
            else console.error(`DataLoader loading ${type}:`, error);
        }

        return dataSourceOrTileset;
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
    async load3D(opt, type) {
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
            const tilesetPromise = await this._loadDataWithProgress(_url, type, _finalOpt);
            // 加载3dtiles的时候要使用readyPromise 
            const _3dtile = await tilesetPromise.readyPromise 
            console.log('3d tileset loaded successfully',_3dtile);

            // Data loaded is bound to the passed-in opt.onSuccess callback
            Object.assign(opt, _finalOpt);

            return _3dtile;

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
    async loadDataSource(url, type, options = {}) {
        switch (type.toLowerCase()) {
            case 'geojson':
                return this.loadGeoJSON(url, options);
            case 'kml':
                return this.loadKML(url, options);
            case 'czml':
                return this.loadCZML(url, options);
            case 'gpx':
                return this.loadGPX(url, options);
            case 'topojson':
                return this.loadTopoJSON(url, options);
            default:
                throw new Error(`Unsupported data source type: ${type}`);
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

export default DataLoader;
