class DataLoader {
    constructor(viewer) {
        this.viewer = viewer;
        this.cache = new Map(); // 缓存机制
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

    async load3DTiles(url, options = {}) {
        return this._loadDataWithProgress(url, '3dtiles', options);
    }

    async loadGPX(url, options = {}) {
        return this._loadDataWithProgress(url, 'gpx', options);
    }

    async loadTopoJSON(url, options = {}) {
        return this._loadDataWithProgress(url, 'topojson', options);
    }

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

    async loadData(url, type, options = {}) {
        switch (type.toLowerCase()) {
            case 'geojson':
                return this.loadGeoJSON(url, options);
            case 'kml':
                return this.loadKML(url, options);
            case 'czml':
                return this.loadCZML(url, options);
            case '3dtiles':
                return this.load3DTiles(url, options);
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
