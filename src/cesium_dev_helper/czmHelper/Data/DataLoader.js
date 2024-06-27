import { typeOf } from "../util/type";

class DataLoader {
    constructor(viewer) {
        this.viewer = viewer;
        this.cache = new Map(); // 缓存机制
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

        // 使用 Cesium.loadWithXhr 实现进度反馈
        const xhr = Cesium.loadWithXhr({
            url,
            responseType: 'json',
            method: 'GET',
            headers: options.headers || {},
            overrideMimeType: options.overrideMimeType || '',
            onProgress: (event) => {
                if (event.lengthComputable && options.onProgress) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    options.onProgress(percentComplete);
                }
            }
        });

        let dataSourceOrTileset;

        try {
            const data = await xhr;
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
                    dataSourceOrTileset = await Cesium.Cesium3DTileset.fromUrl(url, options);
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
            else console.error(`Error loading ${type}:`, error);
        }

        return dataSourceOrTileset;
    }

    /**
     * Function to load multiple 3D tilesets into the Cesium viewer.
     *
     * @param {Cesium.Viewer} viewer - The Cesium viewer object to load the 3D tilesets into.
     * @param {Object|Array} opt - Objects containing the URL and options for each 3D tileset.
     *
     * @returns {Object} This function return at the opt.onSuccess,opt.onError,opt.onProgress
     */
    async load3DTiles(opt) {
        // 确保opt有三个可以返回数据的属性
        let _finalOpt = {
            onSuccess: () => { },
            onError: () => { },
            onProgress: () => { }
        };
        Object.assign(_finalOpt, opt);
        // 解析参数
        let _params = _finalOpt;
        let _url = _params.url;
        delete _params.url
        let _other = _params;
        // 加载一个url
        if (!Array.isArray(opt) && typeOf(_url) == "string" && typeOf(_other) === "object")
            return this._loadDataWithProgress(_url, '3dtiles', _other);
        // 加载多个url
        else if (Array.isArray(opt)) {
            let _opts = opt;
            // 数组元素返回的都是Promise建议使用Promise.all
            // _opts.map(opt => {
            //     this.load3DTiles(opt);
            // });
            return Promise.all(_opts.map(opt => this.load3DTiles(opt)));
        }
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
     * @returns {Promise<Cesium.DataSource|Cesium.Cesium3DTileset>} A promise that resolves to the loaded data source or 3D tileset.
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
            // 重写了加载方式 参数并不和其他数据源加载一致
            // case '3dtiles':
            //     return this.load3DTiles(url, options);
            case 'gpx':
                return this.loadGPX(url, options);
            case 'topojson':
                return this.loadTopoJSON(url, options);
            default:
                throw new Error(`Unsupported data type: ${type}`);
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

export default DataLoader;
