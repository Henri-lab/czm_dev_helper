import * as heat from 'heatmap.js-fixed/build/heatmap'
import { throttle } from 'lodash'

/**
 * CesiumHeat class to add heatmap functionality to a Cesium viewer.
 * @param {Object} Cesium - The Cesium object.
 * @returns {CesiumHeat} The CesiumHeat class.
 */
export default (Cesium) => class CesiumHeat {
    /**
     * Creates an instance of CesiumHeat.
     * @param {Object} viewer - The Cesium viewer instance.
     * @param {Object} data - The data configuration for the heatmap.
     * @param {Array<number>} bbox - The bounding box [west, south, east, north].
     * @param {Object} heatmapConfig - The configuration object for the heatmap.
     * @param {Object} autoRadiusConfig - The auto radius configuration.
     * @param {Object} canvasConfig - The canvas configuration.
     */
    constructor(
        viewer,
        data = { autoMaxMin: true, data: [] },
        bbox = [-180, -90, 180, 90],
        heatmapConfig = {},
        autoRadiusConfig = {
            enabled: true,
            throttle: 200, // ms
            min: 6375000,
            max: 10000000,
            maxRadius: 40,
            minRadius: 10,
        },
        canvasConfig = {
            totalArea: 1036800,
            autoResize: true,
        }
    ) {
        if (typeof window == 'undefined') return

        this.updateCesium = throttle(this._updateCesium, autoRadiusConfig.throttle || 200, { 'trailing': true })

        this.viewer = viewer
        this.bbox = bbox
        this.autoRadiusConfig = autoRadiusConfig
        this.max = undefined
        this.min = undefined

        const [left, bottom, right, top] = bbox
        let height = top - bottom, width = right - left
        this.boxMeta = { top, left, height, width }

        if (canvasConfig.autoResize) {
            if (!canvasConfig.totalArea) {
                throw 'Specify totalArea if auto resize'
            }
            const h = Math.floor(Math.sqrt(height * canvasConfig.totalArea))
            const w = Math.floor(h * width / height)
            this.canvasConfig = { ...canvasConfig, width: w, height: h }
        } else {
            if (!canvasConfig.width || !canvasConfig.height) {
                throw 'Specify width and height if not auto resize'
            }
            this.canvasConfig = canvasConfig
        }

        let config = { ...heatmapConfig }
        if (!config.container) {
            this.mountPoint = newDiv({
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -100,
                overflow: 'hidden',
                width: 0,
                height: 0,
            }, document.body)

            config.container = newDiv({
                width: this.canvasConfig.width,
                height: this.canvasConfig.height
            }, this.mountPoint)
        }
        this.heatmapConfig = config
        this.heatmap = heat.create(config)

        let dataConfig
        if (Array.isArray(data)) {
            dataConfig = { autoMaxMin: true, data }
        } else {
            dataConfig = { ...data }
        }
        if (!dataConfig.autoMaxMin) {
            if (!dataConfig.min || !dataConfig.max) {
                throw 'Need max and min when not auto'
            }
            this.min = dataConfig.min
            this.max = dataConfig.max
        }
        let newData = dataConfig.data.map(x => {
            this.updateMaxMin(x.value)
            return this.convertData(x)
        })
        delete dataConfig.data

        this.dataConfig = dataConfig
        this.data = newData
        let heatdata = { max: this.max, min: this.min, data: newData }
        this.heatmap.setData(heatdata)

        this.updateCesium(autoRadiusConfig.enabled)
        this.cameraMoveEnd = () => this.updateCesium(true)
        this.postRender = () => {
            if (this.postRenderSkip) {
                this.postRenderSkip = false
                return
            }
            this.postRenderSkip = true
            this.updateCesium(true)
        }
        if (autoRadiusConfig.enabled) {
            this.viewer.camera.moveEnd.addEventListener(this.cameraMoveEnd)
        }
    }

    /**
     * Adds one or more data points to the heatmap.
     * @param {Object|Array<Object>} x - The data point(s) to add.
     */
    addData(x) {
        if (Array.isArray(x)) {
            this.data = this.data.concat(x.map(y => {
                this.updateMaxMin(y.value)
                return this.convertData(y)
            }))
        } else {
            this.updateMaxMin(x.value)
            this.data.push(this.convertData(x))
        }
        this.updateCesium(true)
    }

    /**
     * Adjusts the radius of the heatmap points based on the current camera height.
     */
    updateHeatmap() {
        let h = this.viewer.camera.getMagnitude()
        const { min, max, minRadius, maxRadius } = this.autoRadiusConfig
        let newRadius = parseInt(minRadius + (maxRadius - minRadius) * (h - min) / (max - min))

        this.heatmap.setData({
            max: this.max,
            min: this.min,
            data: this.data.map(({ x, y, value }) => {
                return { x, y, value, radius: newRadius }
            })
        })
    }

    /**
     * Updates the Cesium display with the heatmap.
     * @param {boolean} updateHeat - Whether to update the heatmap.
     */
    async _updateCesium(updateHeat) {
        if (this.layer) {
            this.viewer.scene.imageryLayers.remove(this.layer)
        }
        updateHeat && this.updateHeatmap()

        let provider = new Cesium.SingleTileImageryProvider({
            url: this.heatmap.getDataURL(),
            rectangle: Cesium.Rectangle.fromDegrees(...this.bbox)
        })
        this.layer = this.viewer.scene.imageryLayers.addImageryProvider(provider)
    }

    /**
     * Converts coordinates to heatmap data format.
     * @param {Object} param0 - The data point containing coordinates and value.
     * @returns {Object} The converted data point.
     */
    convertData({ x, y, value }) {
        let [px, py] = this.gps2point([x, y])
        return { x: px, y: py, value: value }
    }

    /**
     * Updates the maximum and minimum values of the heatmap data.
     * @param {number} value - The value to compare against the current max and min.
     */
    updateMaxMin(value) {
        if (this.max === undefined) {
            this.max = value
        } else {
            this.max = Math.max(value, this.max)
        }
        if (this.min === undefined) {
            this.min = value
        } else {
            this.min = Math.min(value, this.min)
        }
    }

    /**
     * Converts GPS coordinates to canvas coordinates.
     * @param {Array<number>} gps - The GPS coordinates [longitude, latitude].
     * @returns {Array<number>} The canvas coordinates [x, y].
     */
    gps2point(gps = []) {
        let [x1, y1] = gps
        let { top, left, height, width } = this.boxMeta
        let canvasConfig = this.canvasConfig

        let x = parseInt((x1 - left) / width * canvasConfig.width)
        let y = parseInt((top - y1) / height * canvasConfig.height)
        return [x, y]
    }

    /**
     * Destroys the CesiumHeat instance and removes any event listeners and layers.
     */
    destory() {
        if (this.autoRadiusConfig.enabled) {
            this.viewer.camera.moveEnd.removeEventListener(this.cameraMoveEnd)
        }
        if (this.layer) {
            this.viewer.scene.imageryLayers.remove(this.layer)
        }
        if (this.mountPoint) {
            this.mountPoint.remove()
        }
    }
}

/**
 * Creates a new div element with the given styles and appends it to the parent.
 * @param {Object} style - The styles to apply to the div.
 * @param {HTMLElement} parent - The parent element to append the div to.
 * @returns {HTMLElement} The created div element.
 */
function newDiv(style, parent) {
    let div = document.createElement('div')
    parent && parent.append(div)
    for (let k in style) {
        if (typeof style[k] === 'number') {
            div.style[k] = style[k] + 'px'
            continue
        }
        div.style[k] = style[k]
    }
    return div
}


// 热力图比较------------------------------------------------

// heatmap.js:
// 优点：
// 易于使用
// 配置灵活
// 支持自定义颜色渐变
// 可以处理大规模数据集
// 缺点：
// 对于复杂的地图叠加需要额外处理

// Leaflet.heat:
// 基于 Leaflet.js，适用于地图应用
// 优点：
// 与 Leaflet.js 完美集成
// 易于在地图上叠加热力图
// 缺点：
// 依赖于 Leaflet.js，不适用于其他地图库

// Google Maps Heatmap Layer:
// 基于 Google Maps API
// 优点：
// 与 Google Maps 集成
// 易于在 Google 地图上添加热力图
// 缺点：
// 依赖于 Google Maps API
// 功能可能不如独立的热力图库丰富

// D3.js:
// 强大的数据可视化库
// 优点：
// 高度自定义
// 支持多种数据可视化类型
// 缺点：
// 学习曲线陡峭
// 实现热力图需要更多手动配置
// 选择合适的热力图库
// 选择热力图库取决于您的具体需求：

// 如果需要一个独立的、易于使用的热力图库，heatmap.js 是一个不错的选择。
// 如果您已经在使用 Leaflet.js 并且需要在地图上显示热力图，Leaflet.heat 是理想的选择。
// 如果您的应用基于 Google Maps，使用 Google Maps 的热力图层可能更合适。
// 如果您需要高度定制的数据可视化，并且不介意复杂度，D3.js 是一个强大的工具。