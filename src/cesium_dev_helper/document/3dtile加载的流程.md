cesium_dev_helper 的 3D 瓦片加载流程
老版 但是思路一致

```javascript
let viewer;

async _loadDataWithProgress(url, options = {}) {
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
     try{
        let dataSourceOrTileset = await Cesium.Cesium3DTileset.fromUrl(url, options);

        viewer.dataSources.add(dataSourceOrTileset);

        if (options.onSuccess) options.onSuccess(dataSourceOrTileset);
     }catch(e){
        if (options.onError) options.onError(error);
        else console.error(`Error loading :`, error);
     }
        return dataSourceOrTileset;
}


async load3DTiles(opt) {
    // 确保opt有三个可以返回数据的属性
    let _finalOpt = {
        onSuccess: () => {},
        onError: () => {},
        onProgress: () => {}
    };
    Object.assign(_finalOpt, opt);

    // 解析参数
    let _url = _finalOpt.url;
    delete _finalOpt.url;

    if (!Array.isArray(opt) && typeof _url === "string" && typeof _finalOpt === "object") {
        return this._loadDataWithProgress(_url, _finalOpt);
    } else if (Array.isArray(opt)) {
        let _opts = opt;
        return Promise.all(_opts.map(opt => this.load3DTiles(opt)));
    }
}

async add3DTiles(options, cb) {
    let res = [];
    if (Array.isArray(options)) {
        await this.load3DTiles(options);
        for (let opt of options) {
            opt.onSuccess = (tile) => {
                if (tile) {
                    this.viewer.scene.primitives.add(tile);
                }
                opt.onProgress = (progress) => {
                    res.push({
                        loadTime: Date.now(),
                        tile,
                        progress,
                    });
                    cb(res);
                };
            };
            opt.onError = (e) => console.error(e, 'Failed loading 3D tile');
        }
    } else {
        const tile = await this.load3DTiles(options);
        this.viewer.scene.primitives.add(tile);
        options.onSuccess(tile);
        cb([{
            loadTime: Date.now(),
            tile,
            progress: 100,
        }]);
    }
}

```
