import * as Cesium from "cesium";
import Manager from "./Manager";

class MaterialManager extends Manager{
    constructor(viewer) {
        super(viewer);
        this.defaultUniforms = {
            color: Cesium.Color.WHITE,
            time: 0.0
        };

        this.defaultTranslucent = true;
        this.materialLibrary = {};
        this.debugMode = false;
        this.cacheEnabled = true;
        this.materialCache = {}; // 用于缓存材质，避免重复创建
        this.textureCache = {}; // 纹理缓存，用于异步加载和释放管理
        this.animationCallbacks = []; // 动画回调函数队列
    }

    // 创建材质动画系统：支持时间动画、平滑过渡等效果
    createAnimatedMaterial(baseMaterial, animationFn) {
        const animatedMaterial = baseMaterial;

        // 注册动画更新回调
        this.animationCallbacks.push((time) => {
            animationFn(animatedMaterial, time);
        });

        return animatedMaterial;
    }

    // 开启材质动画循环
    startAnimationLoop() {
        this.viewer.clock.onTick.addEventListener((clock) => {
            const currentTime = clock.currentTime.secondsOfDay;
            this.animationCallbacks.forEach((callback) => callback(currentTime));
        });
    }

    // LOD 支持：根据距离更新材质细节
    createLodMaterial(materialConfigs) {
        const lodMaterial = this.createTextureMaterial(materialConfigs[0].textureUrl);

        this.viewer.scene.preRender.addEventListener(() => {
            const cameraDistance = Cesium.Cartesian3.distance(this.viewer.camera.position, this.viewer.scene.globe.ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(0, 0)));

            if (cameraDistance < 1000) {
                lodMaterial.uniforms.image = materialConfigs[0].textureUrl; // 高分辨率纹理
            } else {
                lodMaterial.uniforms.image = materialConfigs[1].textureUrl; // 低分辨率纹理
            }
        });

        return lodMaterial;
    }

    // 纹理缓存系统：异步加载并缓存纹理
    async createTextureMaterialAsync(textureUrl, translucent = this.defaultTranslucent, options = {}) {
        const materialKey = `texture-${textureUrl}`;
        if (this.cacheEnabled && this.materialCache[materialKey]) {
            return this.materialCache[materialKey];
        }

        const texture = await this._loadTextureAsync(textureUrl); // 异步加载纹理

        const material = new CustomMaterial('textureMaterial', {
            type: 'textureMaterial',
            uniforms: {
                image: texture
            },
            source: `
            uniform sampler2D image;
            czm_material czm_getMaterial(czm_materialInput materialInput) {
                czm_material material = czm_getDefaultMaterial(materialInput);
                vec2 st = materialInput.st;
                vec4 color = texture2D(image, st);
                material.diffuse = color.rgb;
                material.alpha = color.a;
                return material;
            }
            `,
            translucent: translucent,
            textures: {
                image: texture
            },
            ...options
        });

        this._addToLibrary('textureMaterial', material);
        this.materialCache[materialKey] = material;
        return material;
    }

    // 异步加载纹理资源，支持缓存
    async _loadTextureAsync(textureUrl) {
        if (this.textureCache[textureUrl]) {
            return this.textureCache[textureUrl];
        }

        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = textureUrl;
            image.onload = () => {
                this.textureCache[textureUrl] = textureUrl; // 缓存纹理
                resolve(textureUrl);
            };
            image.onerror = () => reject(new Error('Failed to load texture: ' + textureUrl));
        });
    }

    // GPU 资源管理：释放缓存的材质和纹理
    clearCache() {
        this.materialCache = {};
        this.textureCache = {};
        if (this.debugMode) {
            console.log('Cache cleared');
        }
    }

    // 支持响应事件的材质更新，例如鼠标交互或场景变化
    createEventResponsiveMaterial(baseMaterial, eventHandler) {
        const eventMaterial = baseMaterial;
        eventHandler((newUniforms) => {
            Object.assign(eventMaterial.uniforms, newUniforms);
        });

        return eventMaterial;
    }

    // 性能分析工具：监测材质的使用频率和开销，帮助优化
    analyzeMaterialPerformance() {
        const stats = {};
        this.viewer.scene.preRender.addEventListener(() => {
            Object.keys(this.materialLibrary).forEach((key) => {
                const material = this.materialLibrary[key];
                stats[key] = stats[key] || 0;
                stats[key]++;
            });
        });

        return stats;
    }

    // 创建自定义材质，并支持 Web Worker 来执行复杂的异步任务
    createWebWorkerMaterial(glslCode, uniforms = {}, options = {}) {
        const materialKey = `worker-${JSON.stringify(uniforms)}-${glslCode}`;
        if (this.cacheEnabled && this.materialCache[materialKey]) {
            return this.materialCache[materialKey];
        }

        const worker = new Worker('./'); 

        const material = new CustomMaterial('webWorkerMaterial', {
            type: 'webWorkerMaterial',
            uniforms: uniforms,
            source: `
            ${glslCode}
            czm_material czm_getMaterial(czm_materialInput materialInput) {
                czm_material material = czm_getDefaultMaterial(materialInput);
                // 用户自定义的 GLSL 代码会在这里注入
                return material;
            }
            `,
            ...options
        });

        worker.postMessage({ uniforms, glslCode });

        worker.onmessage = (event) => {
            Object.assign(material.uniforms, event.data.uniforms);
        };

        this._addToLibrary('webWorkerMaterial', material);
        this.materialCache[materialKey] = material;
        return material;
    }

    // 注册自定义材质
    registerCustomMaterial(name, customMaterial) {
        this.materialLibrary[name] = customMaterial;
    }

    // 获取已注册材质
    getMaterial(name) {
        return this.materialLibrary[name];
    }

    // 缓存管理功能
    enableCache(enabled) {
        this.cacheEnabled = enabled;
        if (this.debugMode) {
            console.log(`Cache enabled: ${this.cacheEnabled}`);
        }
    }

    // 设置调试模式
    setDebugMode(enabled) {
        this.debugMode = enabled;
    }

    // 内部方法：添加材质到材质库
    _addToLibrary(name, material) {
        this.materialLibrary[name] = material;
        if (this.debugMode) {
            console.log(`Material '${name}' added to library`, material);
        }
    }
}

