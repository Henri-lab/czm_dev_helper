import * as _Cesium from 'cesium';
import * as _THREE from 'three';
import { geometryToBufferGeometry } from '../util/cesiumToThree';
//参考@https://github.com/dengxiaoning/cesium_dev_kit.git

let Cesium, THREE;
export default class threePlugin {
    constructor(viewer, threeConf, defaultStatic) {
        if (viewer && threeConf) {
            Cesium = threeConf.cesiumGlobal || _Cesium
            THREE = threeConf.threeGlobal || _THREE
            this._three = {
                renderer: null,
                camera: null,
                scene: null//custom
            }
            this._threeDiv = this._getDom(threeConf.threeDom, 'div')
            this._viewer = viewer
            this._czm3Scene = useThreeCesiumScene({ viewer, THREE, Cesium })
            if (threeConf.initStyle) this._initStyleThree()
        }
    }

    _getDom(dom, typeDef = 'div') {
        let res
        if (typeof dom === 'string') {
            res = document.getElementById(dom)
        } else if (dom instanceof HTMLElement) {
            res = dom
        } else {
            res = document.createElement(typeDef)
            document.getElementsByTagName('body')[0].appendChild(res)
        }
        return res
    }
    _initStyleThree() {
        let threeContainer = this._threeDiv
        threeContainer.style.position = 'absolute'
        threeContainer.style.top = 0
        threeContainer.style.left = 0
        threeContainer.style.height = '100%'
        threeContainer.style.width = '100%'
        threeContainer.style.margin = 0
        threeContainer.style.overflow = 'hidden'
        threeContainer.style.padding = 0
        threeContainer.style.fontFamily = 'sans-serif'
        threeContainer.style.pointerEvents = 'none'
        this._threeDiv = threeContainer
    }
    install(options = {}) {
        let that = this
        let _fov = options.fov || 45,
            _aspect = options.aspect || window.innerWidth / window.innerHeight,
            _near = options.near || 1,
            _far = options.far || 10 * 1000 * 1000
        that._three.camera = new THREE.PerspectiveCamera(_fov, _aspect, _near, _far)
        that._three.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer: true,
            stencil: true,
            depth: true
        })
        that._three.renderer.outputEncoding = THREE.sRGBEncoding
        that._three.renderer.shadowMap.enabled = true
        that._three.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        that._three.scene = new that._czm3Scene({
            threeHabit: options.threeHabit || true,
            enableLighting: options.enableLightinh || false,
            axesHelper: options.axesHelper || true,
            camera: that._three.camera,
            renderer: that._three.renderer,
            lngLat: options.center,
        })
        if (that._threeDiv) {
            that._threeDiv.appendChild(that._three.renderer.domElement)
        }
        return that._three
    }
    loop(callback) {
        //callback自带this问题处理
        if (callback.toString().includes('this')) {
            console.error('callback function have wrong "this" scope')
            return
        }
        const _loop = function () {
            let frame = requestAnimationFrame(_loop)
            callback && callback(frame)
        }
        _loop()
    }
    destroy() {
        this._three.scene.dispose()
    }
}

// 目的主要有以下几点：
// 同步地球表面：
// 创建一个与 Cesium 地球相同的球体（或多个球体）在 Three.js 场景中，作为地球表面的代表。这样，Three.js 的对象可以正确地放置在地球表面上，位置和缩放都与 Cesium 地球一致。
// 处理坐标系和单位差异：
// Cesium 使用的是地理坐标系，单位为米，而 Three.js 的默认坐标系和单位可能不同。通过创建这些几何体，并进行相应的位移和旋转调整，可以使两者的坐标系对齐。
// 视觉效果和渲染同步：
// 添加太阳光源和地球表面的补偿球体，可以使 Three.js 中的对象在视觉上与 Cesium 场景融为一体，光照和阴影效果一致，增强整体的真实感。
// 提供放置对象的基准：
// childGroup 作为一个容器，用户可以将自己的 Three.js 对象添加到其中。通过同步 childGroup 的位置和旋转，可以确保这些对象在 Cesium 场景中正确显示。
function useThreeCesiumScene({ viewer, THREE = _THREE, Cesium = _Cesium }) {
    class czm3Scene extends THREE.Scene {
        constructor(options = {}) {
            super()
            this.type = 'ThreeCesiumScene'
            this.check(options)
            this.options = options
            this.cesiumViewer = viewer
            this.ellipsoid = this.cesiumViewer.scene.globe.ellipsoid  //cesium地球椭球体
            !!options.threeHabit && this.syncOperation()
            this.camera = options.camera
            this.cameraOffset = new THREE.Vector3()
            this.renderer = options.renderer// 渲染器必须开启 logarithmicDepthBuffer,stencil
            this.lngLat = options.lngLat && options.lngLat.length > 1 ? options.lngLat : [114.23, 31.55]
            this.cameraCenter = new THREE.Vector3(0, 0, 0)
            this.earth = null
            this.initEarth()//模拟地球
            if (options.axesHelper)
                this.earth.add(new THREE.AxesHelper(8000000))
            this.sunGroup = new THREE.Group()//模拟太阳
            this.initSunGroup()
            this.syncGroup = new THREE.Group()//3D同步
            this.initSyncGroup()
            this._enableLighting = true  //太阳光设置
            this.lightSettingProxy()
        }
        check(options) {
            if (!options.camera || !(options.camera instanceof THREE.PerspectiveCamera)) {
                throw new Error(
                    'THREE.ThreeCesiumScene (not found cesiumDom) OR ( not THREE.PerspectiveCamera ).'
                )
            }
            if (!options.renderer) {
                throw new Error('THREE.ThreeCesiumScene not found THREE.WebGLRender.')
            }
        }
        syncOperation() {
            // 倾斜视图 鼠标左键旋转
            this.cesiumViewer.scene.screenSpaceCameraController.tiltEventTypes = [
                Cesium.CameraEventType.LEFT_DRAG
            ]
            // 缩放设置 重新设置缩放成员
            this.cesiumViewer.scene.screenSpaceCameraController.zoomEventTypes = [
                Cesium.CameraEventType.MIDDLE_DRAG,
                Cesium.CameraEventType.WHEEL,
                Cesium.CameraEventType.PINCH
            ]
            // 平移 添加鼠标右键  鼠标右键平移
            this.cesiumViewer.scene.screenSpaceCameraController.rotateEventTypes = [
                Cesium.CameraEventType.RIGHT_DRAG
            ]
        }
        initEarth() {
            const ellipsoid = new Cesium.EllipsoidGeometry({// Create a sphere geometry to simulate the Earth
                vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                radii: new Cesium.Cartesian3(
                    this.ellipsoid.maximumRadius - 1,
                    this.ellipsoid.maximumRadius - 1,
                    this.ellipsoid.minimumRadius - 1
                ),
                slicePartitions: 1024, //8132,
                stackPartitions: 1024
            })
            const geometry = geometryToBufferGeometry(
                Cesium.EllipsoidGeometry.createGeometry(ellipsoid),
                new THREE.BufferGeometry(),
                THREE
            )
            const material = new THREE.MeshBasicMaterial({
                color: '#ff00ff',
                blending: THREE.MultiplyBlending
            })
            const sphere = new THREE.Mesh(geometry, material)
            super.add(sphere)
            this.earth = sphere
        }
        initSyncGroup() {
            const syncGroup = new THREE.Group()
            super.add(syncGroup)
            syncGroup.add(this.sunGroup)

            const childGroup = new THREE.Group()
            childGroup.rotateX((-90 * Math.PI) / 180)
            childGroup.position.z = -1

            const geometry = new THREE.SphereGeometry(
                this.ellipsoid.minimumRadius,
                512,
                256,
                0,
                Math.PI * 2,
                3.1,
                Math.PI - 3.1
            )
            const material = new THREE.MeshBasicMaterial({
                color: '#fff00f',
                blending: THREE.MultiplyBlending
            })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.rotateX((90 * Math.PI) / 180)
            sphere.position.z = this.ellipsoid.minimumRadius

            childGroup.add(sphere)
            syncGroup.add(childGroup)

            this.childrenGroup = childGroup
            this.syncGroup = syncGroup
        }
        initSunGroup() {
            this.sunLightColor = new THREE.Color()
            this.sunLightIntensity = 1

            const light = this.cesiumViewer.scene.light

            this.sunLightColor.r = light.color.red
            this.sunLightColor.g = light.color.green
            this.sunLightColor.b = light.color.blue

            this.sunLightIntensity = light.intensity

            this.sun = new THREE.DirectionalLight(
                this.sunLightColor,
                this.sunLightIntensity
            )
            this.sun.castShadow = true
            this.sun.shadow.camera.far = Math.pow(10, 14)
            this.sun.position.set(0, 0, this.ellipsoid.maximumRadius * 2 + 1000)
            this.sun.target = this.childrenGroup
            this.sunGroup.add(this.sun)
        }
        lightSettingProxy() {
            Object.defineProperty(this, 'enableLighting', {
                get() {
                    return this._enableLighting
                },
                set(v) {
                    this.cesiumViewer.scene.globe.enableLighting = v
                    this._enableLighting = v
                    if (v) {
                        this.sun.visible = true
                        return
                    }
                    this.sun.visible = false
                }
            })
            this.enableLighting = false
        }
        renderCesium() {
            this.cesiumViewer.render()
            return this
        }
        renderThree() {
            this.renderer.render(this, this.camera)
            return this
        }
        updateSunMatrix() {
            const cc = this.cesiumViewer.scene.sun._boundingVolume.center
            const c3 = this.cartesian3ToVector(cc)

            this.sunGroup.lookAt(
                c3.x - this.cameraOffset.x,
                c3.y - this.cameraOffset.y,
                -(c3.z - this.cameraOffset.z)
            )

            return this
        }
        updateCameraMatrix() {
            //同步相机
            this.camera.fov = Cesium.Math.toDegrees(
                this.cesiumViewer.camera.frustum.fovy
            ) // ThreeJS FOV is vertical
            this.camera.updateProjectionMatrix()

            this.camera.matrixAutoUpdate = false
            const cvm = this.cesiumViewer.camera.viewMatrix
            const civm = this.cesiumViewer.camera.inverseViewMatrix
            this.camera.lookAt(this.cameraCenter)
            this.camera.matrixWorld.set(
                civm[0],
                civm[4],
                civm[8],
                civm[12] - this.cameraOffset.x,
                civm[1],
                civm[5],
                civm[9],
                civm[13] - this.cameraOffset.y,
                civm[2],
                civm[6],
                civm[10],
                civm[14] - this.cameraOffset.z,
                civm[3],
                civm[7],
                civm[11],
                civm[15]
            )
            this.camera.matrixWorldInverse.set(
                cvm[0],
                cvm[4],
                cvm[8],
                cvm[12] - this.cameraOffset.x,
                cvm[1],
                cvm[5],
                cvm[9],
                cvm[13] - this.cameraOffset.y,
                cvm[2],
                cvm[6],
                cvm[10],
                cvm[14] - this.cameraOffset.z,
                cvm[3],
                cvm[7],
                cvm[11],
                cvm[15]
            )

            const width = this.cesiumViewer.scene.canvas.clientWidth
            const height = this.cesiumViewer.scene.canvas.clientHeight
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()

            this.renderer.setSize(width, height)

            return this
        }
        updateGroupMatrixWorld() {
            // 得到面向模型的前向方向
            const center = this.cartesian3ToVector(
                Cesium.Cartesian3.fromDegrees(this.lngLat[0], this.lngLat[1], 0)
            )
            // 使用从左下到左上的方向作为上向量
            const topLeft = this.cartesian3ToVector(
                Cesium.Cartesian3.fromDegrees(this.lngLat[0], this.lngLat[1], 2)
            )
            const latDir = new THREE.Vector3().subVectors(center, topLeft).normalize()

            // 配置实体的位置和方向
            // this.syncGroup.position.copy(center)
            this.syncGroup.lookAt(latDir)
            this.syncGroup.up.copy(latDir)
            this.syncGroup.updateMatrix()

            this.cameraOffset.copy(center)

            // this.sphere.position.set(0 - center.x, 0 - center.y, 0 - center.z)
            this.syncGroup.up.set(0, 0, -1)
            this.up.set(0, 0, -1)

            return this
        }
        update() {
            this.updateSunMatrix()
            this.updateGroupMatrixWorld()
            this.updateCameraMatrix()
            this.renderThree()
            this.renderCesium()
        }
        add(object) {
            if (arguments.length > 1) {
                for (let i = 0; i < arguments.length; i++) {
                    this.childrenGroup.add(arguments[i])
                }

                return this
            }

            if (object === this) {
                console.error(
                    "THREE.Object3D.add: object can't be added as a child of itself.",
                    object
                )
                return this
            }

            if (object && object.isObject3D) {
                if (object.parent !== null) {
                    object.parent.remove(object)
                }

                object.parent = this.childrenGroup
                this.childrenGroup.children.push(object)
                object.dispatchEvent({ type: 'added' })
            } else {
                console.error(
                    'THREE.Object3D.add: object not an instance of THREE.Object3D.',
                    object
                )
            }

            return this
        }
        remove(object) {
            if (arguments.length > 1) {
                for (let i = 0; i < arguments.length; i++) {
                    this.childrenGroup.remove(arguments[i])
                }

                return this
            }

            const index = this.childrenGroup.children.indexOf(object)

            if (index !== -1) {
                object.parent = null
                this.childrenGroup.children.splice(index, 1)
                object.dispatchEvent({ type: 'removed' })
            }

            return this
        }
        clear() {
            for (let i = 0; i < this.childrenGroup.children.length; i++) {
                const object = this.childrenGroup.children[i]
                object.parent = null
                object.dispatchEvent({ type: 'removed' })
            }

            this.childrenGroup.children.length = 0
            return this
        }
        traverse(callback) {
            callback(this.childrenGroup)
            const children = this.childrenGroup.children

            for (let i = 0, l = children.length; i < l; i++) {
                children[i].traverse(callback)
            }
        }
        traverseVisible(callback) {
            if (this.visible === false || this.childrenGroup.visible === false) return
            callback(this.childrenGroup)
            const children = this.childrenGroup.children

            for (let i = 0, l = children.length; i < l; i++) {
                children[i].traverseVisible(callback)
            }
        }
        toJSON(meta) {
            const isRootObject = meta === undefined || typeof meta === 'string'
            const output = {}

            if (isRootObject) {
                meta = {
                    geometries: {},
                    materials: {},
                    textures: {},
                    images: {},
                    shapes: {},
                    skeletons: {},
                    animations: {},
                    nodes: {},
                    options: {}
                }
                output.metadata = {
                    version: 4.5,
                    type: 'Object',
                    generator: 'Object3D.toJSON'
                }
            }

            const object = {}
            object.uuid = this.uuid
            object.type = this.type
            if (this.name !== '') object.name = this.name
            if (this.castShadow === true) object.castShadow = true
            if (this.receiveShadow === true) object.receiveShadow = true
            if (this.visible === false) object.visible = false
            if (this.frustumCulled === false) object.frustumCulled = false
            if (this.renderOrder !== 0) object.renderOrder = this.renderOrder
            if (JSON.stringify(this.userData) !== '{}')
                object.userData = this.userData
            object.layers = this.layers.mask
            object.matrix = this.matrix.toArray()
            if (this.matrixAutoUpdate === false) object.matrixAutoUpdate = false // object specific properties

            if (this.background) {
                if (this.background.isColor) {
                    object.background = this.background.toJSON()
                } else if (this.background.isTexture) {
                    object.background = this.background.toJSON(meta).uuid
                }
            }

            if (this.environment && this.environment.isTexture) {
                object.environment = this.environment.toJSON(meta).uuid
            }

            if (this.fog !== null) object.fog = this.fog.toJSON()

            if (this.options) {
                object.options = {}
                for (const key in this.options) {
                    if (['camera', 'renderer'].includes(key)) continue
                    object.options[key] = this.options[key]
                }
            }

            if (this.childrenGroup.children.length > 0) {
                object.children = []

                for (let i = 0; i < this.childrenGroup.children.length; i++) {
                    object.children.push(
                        this.childrenGroup.children[i].toJSON(meta).object
                    )
                }
            }

            if (isRootObject) {
                const geometries = extractFromCache(meta.geometries)
                const materials = extractFromCache(meta.materials)
                const textures = extractFromCache(meta.textures)
                const images = extractFromCache(meta.images)
                const shapes = extractFromCache(meta.shapes)
                const skeletons = extractFromCache(meta.skeletons)
                const animations = extractFromCache(meta.animations)
                const nodes = extractFromCache(meta.nodes)
                if (geometries.length > 0) output.geometries = geometries
                if (materials.length > 0) output.materials = materials
                if (textures.length > 0) output.textures = textures
                if (images.length > 0) output.images = images
                if (shapes.length > 0) output.shapes = shapes
                if (skeletons.length > 0) output.skeletons = skeletons
                if (animations.length > 0) output.animations = animations
                if (nodes.length > 0) output.nodes = nodes
            }

            object.isGIS = true

            output.object = object

            return output

            function extractFromCache(cache) {
                const values = []

                for (const key in cache) {
                    const data = cache[key]
                    delete data.metadata
                    values.push(data)
                }

                return values
            }
        }
        dispose() {
            this.update = () => { }
            this.renderCesium = () => { }
            this.renderThree = () => { }
            this.updateSunMatrix = () => { }
            this.updateCameraMatrix = () => { }
            this.updateGroupMatrixWorld = () => { }
            this.cesiumViewer.destroy()
            // super.dispose()
        }
        cartesian3ToVector(cart) {
            return new THREE.Vector3(cart.x, cart.y, cart.z)
        }
    }
    czm3Scene.prototype.isScene = true
    czm3Scene.prototype.isGIS = true

    return czm3Scene
}
