function featureStyle(options) {
  return new ol.style.Style({
    fill: new ol.style.Fill({
      color: options.fillColor || 'rgba(255, 255, 255, 0.4)' // 默认填充颜色为白色透明
    }),
    stroke: new ol.style.Stroke({
      color: options.strokeColor || '#3399CC', // 默认边框颜色为蓝色
      width: options.strokeWidth || 1, // 默认边框宽度为1
      lineDash: options.lineDash || [0], // 默认实线样式
      lineCap: options.lineCap || 'round', // 默认线帽样式为圆形
      lineJoin: options.lineJoin || 'round', // 默认线连接样式为圆形
      miterLimit: options.miterLimit || 10 // 默认斜接限制为10
    }),
    // 其他属性根据需要添加
  });
}

// 经典排他
// 清除$layer樣式，將需要添加樣式的feature放在集合featuresNeedStyleArr中
function setFeaturesStyleSingle($layersArr, featuresNeedStyleArr, style) {
  if ($layersArr.length === 0) return
  $layersArr.forEach(layer => {
    layer.getSource()
      .getFeatures()
      .forEach((item) => {
        item.setStyle(null)
      })
    featuresNeedStyleArr.forEach((feature) => { feature && feature.setStyle(style) })
  })
}

export { setFeaturesStyleSingle, featureStyle }