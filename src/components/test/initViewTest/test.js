const test_loadtiles = () => {
    console.log('test');
    const p = new Cesium3DTileset({
        url: '/src/mock/3dtiles/Tile_+000_+000/tileset.json',
    });
    console.log($viewer.scene)
    p.readyPromise.then((tileset) => {
        $viewer.scene.primitives.add(tileset);
        $viewer.zoomTo(tileset);
    });
};

// -------------------------------------------------------------

const handleUploadTestModel = async (url, type) => {
    // 打开上传文件视图
    isUpload.value = true;
    // 一个可以接到加载后model的callback
    const handleLoadedModel = (res) => {
        console.log(`load ${type} successfully`, res);
        if (res) {
            // 加载好model 关闭上传文件视图
            // 模拟大量数据加载的时间  -- 3s
            setTimeout(() => {
                isUpload.value = false;
            }, 3000);
        }
        // else {// 无效😈 因为加载不出来 就不会执行回调
        //     alert(`load ${type} failed`);
        //     console.log('加载失败');
        //     isUpload.value = false;
        // } 
    }


    await initModelAt(
        $viewer,
        {
            url,
        },
        type,
        handleLoadedModel
    );
}