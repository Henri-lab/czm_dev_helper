
export function EllipseGraphics(options = {}) {

    if (options) {
        return new Cesium.EllipseGraphics({
            ...options,
            // 单位=米
            semiMajorAxis: options.semiMajorAxis || 10000.0,
            semiMinorAxis: options.semiMinorAxis || 10000.0,
            outlineColor: this._objHasOwnProperty(
                options,
                'outlineColor',
                Cesium.Color.RED
            ),
            height: options.height || 10,
            metarial: options.metarial || Cesium.Color.RED.withAlpha(0.5),
            outline: this._objHasOwnProperty(options, 'outline', true)
        })
    }
}
