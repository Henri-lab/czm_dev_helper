
export function BoxGraphics(options) {
    options = options || {}
    if (options) {
        return new Cesium.BoxGraphics({
            show: this._objHasOwnProperty(options, 'show', true),
            fill: this._objHasOwnProperty(options, 'fill', true),
            dimensions: options.dimensions || new Cesium.Cartesian3(0, 0, 0),
            material: options.material,
            outline: this._objHasOwnProperty(options, 'outline', true),
            outlineColor: options.outlineColor || Cesium.Color.BLACK,
            distanceDisplayCondition: options.distanceDisplayCondition || undefined
        })
    }
}