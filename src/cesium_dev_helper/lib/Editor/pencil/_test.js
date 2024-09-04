const pointEntity = this.viewer.entities.add({
    position: options.positions[0],
    point: {
        pixelSize: 10,
        color: Cesium.Color.RED
    },
    label: {
        text: 'Sample Point',
        font: '14pt sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9)
    }
});
