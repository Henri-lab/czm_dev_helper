// 1.觸發事件對象 e
// 2.輸入地圖和你想操作的圖層名稱 $map, layerName;
// 3.如果你指定了index:
// --那麽你所mousemove的位置有features的話則返回第index個;反之則返回NULL;
// 4.cb回調獲得全部的featuresAtPixel數組
function getFeatureAtPixel(e, $map, layerName, index) {
    if (typeof e !== 'object' || typeof $map !== 'object' || typeof layerName !== "string") return

    let featureByIndex = null
    let featureArr = []
    const pixel = $map.getEventPixel(e.originalEvent)

    if (pixel) {
        // mousemove到有feature的區域
        let i = 0
        $map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            // 獲取name為layerName的圖層的features數組
            if (layer.get('name') === layerName) {
                featureArr.push(feature)
                i++
                // 如果指定index且合法則返回name為layerName的圖層的features數組的第index個元素
                // 如果指定index大於name為layerName的圖層的features數組長度則返回null
                // 如果你指定了index，就不会遍历完所有features
                if (typeof index === 'number') {
                    if (i === index) {
                        featureByIndex = feature; // feature=features[index]
                    } else if (index > featureArr.length - 1 || index < 0) {
                        console.error(`Invalid index when getfeatureAtPixel in ${layerName} layer`);
                        featureByIndex = null;
                    }
                }
            }
        })

        // 没有指定index，则返回features数组
        if (!index) return featureArr

        // mousemove到沒有feature的區域
        // if (!$map.forEachFeatureAtPixel(pixel, () => true) || featureArr.length === 0) return null
        if (!$map.hasFeatureAtPixel(pixel)) return null

        return featureByIndex

    } else console.error('getEventPixel fail')
}


function getPropsFromFeatureByAliyun(featuresArr) {
    return featuresArr.map((feature) => {
        return {
            name: feature.get('name'),
            adcode: feature.get('adcode'),
            level: feature.get('level'),
            center: feature.get('center'),
            centroid: feature.get('centroid'),
            childrenNum: feature.get('childrenNum'),
            parent: feature.get('parent'),
            subFeatureIndex: feature.get('subFeatureIndex'),
            acroutes: feature.get('acroutes')
        }
    })

}


export { getFeatureAtPixel, getPropsFromFeatureByAliyun }