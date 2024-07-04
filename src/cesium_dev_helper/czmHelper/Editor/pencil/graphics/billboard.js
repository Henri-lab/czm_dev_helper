
export function BillboardGraphics(options) {
    options = options || {}
    if (options && options.b_img) {
        return new Cesium.BillboardGraphics({
            image: options.b_img,
            width: options.b_width || 35,
            height: options.b_height || 35,
            clampToGround: options.b_clampToGround || true,
            scale: options.b_scale || 1,
            // eyeOffset :new Cesium.Cartesian2(0, -20),
            pixelOffset: options.b_pixelOffset || new Cesium.Cartesian2(0, -20),
            scaleByDistance: options.b_scaleByDistance || undefined
            // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
        })
    }
}