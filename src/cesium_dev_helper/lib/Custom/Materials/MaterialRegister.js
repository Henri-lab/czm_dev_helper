import * as Cesium from "cesium";
export default class MaterialRegister {
    constructor(type, options, viewer) {
        this._materialTypes = this._allTypes()
        if (!this._isValidType(type)) return
        this._type = type;
        this._update = options.update || ((time) => { });
        this._materialCache = Cesium.Material._materialCache;
        this.extraOpt = { translucent: false };
        this.registerMaterial(options);
        requestAnimationFrame(() => this._animation(viewer));
        this.material = Cesium.Material.fromType(this._type)
    }

    _allTypes() {
        let types = [];
        for (const key in this._materialCache) {
            if (this._materialCache.hasOwnProperty(key)) {
                _materialTypes.push(key);
            }
        }
        return types;
    }

    _isValidType(type) {
        if (!type) return;
        if (typeof type !== 'string') return
        return !this._materialTypes.includes(type);
    }

    _addCustomMaterial(options) {
        options.type = this._type
        Cesium.Material._materialCache.addMaterial(this._type, {
            fabric: {
                ...options,
            },
            ...this.extraOpt
        });
    }

    _animation(viewer) {
        this._update(this.material.uniforms)
        // viewer && viewer.scene.requestRender()
        requestAnimationFrame(() => this._animation(viewer));
    }

    // 注册材质
    registerMaterial(options) {
        for (let key in options) {
            if (options.hasOwnProperty(key)) {
                if (key == 'translucent') {
                    this.extraOpt[key] = (typeof options[key] === 'function' ? options[key](options) : options[key]) || false
                    delete options[key]
                }
                if (!(key == 'uniforms' || key == 'translucent' || key == 'source' || key == 'components')) {
                    delete options[key]
                }
                typeof options[key] === 'function' &&
                    (options[key] = options[key](options))
            }
        }
        this._addCustomMaterial(options);
    }

    getMaterial() {
        return this.material;
    }

};


