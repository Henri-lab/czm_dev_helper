// 其实喜欢compositionAPI更多 但是选择option API风格，为了更好的兼容vuex习惯;
import { defineStore } from 'pinia'
import { displayAllByName } from '../cesium_dev_helper/traffic/metro';

export const useLineData = defineStore("lineData", {
    state: () => {
        return {
            lineData: [],
            // 全局共享viewer，注意标记为markRaw
            viewer: null,
            tileset: null,
            disable: false,
        };
    },
    getters: {
        // 获取全部信息
        allData() {
            return this.lineData;
        },
        Viewer() {
            return this.viewer;
        },
        Tile() {
            return this.tileset;
        },
        // 是否启用全局管理地铁路线
        isDisable() {
            return this.disable;
        }
    },
    actions: {
        // 此处的Promise
        // 提供一致的接口：
        // --如果你的其他方法返回 Promise，那么保持一致性是有价值的。
        // 未来扩展性：
        // --如果你计划在将来添加异步操作，这样的写法使得添加异步逻辑变得更加简单。
        // 调用者方便：
        // --调用者可以使用 then 和 catch 进行链式调用，这在需要进行后续操作时是有用的。
        setData(data) {
            return new Promise((resolve, reject) => {
                this.lineData = data.length ? data : [];
                resolve(data);
            });
        },
        setViewer(viewer) {
            return new Promise((resolve, reject) => {
                this.viewer = viewer;
                resolve(viewer);
            });
        },
        setTileset(tileset) {
            return new Promise((resolve, reject) => {
                this.tileset = tileset;
                resolve(tileset);
            });
        },
        // 全局管理metro路线的显隐
        displayLine(lineNames, isShow) {
            if (Array.isArray(lineNames) && this.lineData.length && !this.disable) {
                const stationNames = [];
                // 控制state数据
                this.lineData.forEach(line => {
                    const { stationsList, name } = line;
                    if (lineNames.includes(name)) {
                        line.checked = isShow;
                        stationsList.forEach((station) => {
                            stationNames.push(station.name);
                        });
                    }
                });
                // 控制地图元素
                displayAllByName(lineNames, stationNames, isShow);
            }
        },
        // 控制全部图层显示隐藏
        controlAll(isShow) {
            const lineNames = []
            const stationNames = []
            this.lineData.forEach(line => {
                const { name, stationsList } = line
                lineNames.push(name)
                stationsList.forEach(station => {
                    const { name } = station
                    stationNames.push(name)
                })
            })
            // 控制地图所有的line和station元素
            displayAllByName(lineNames, stationNames, isShow);
        },
        // 根据当前保存的checked状态重新渲染地图元素
        reRenderLine() {
            if (this.lineData.length && !this.disable) {
                const lineNames = [];
                const stationNames = [];
                const unCheckedLineNames = [];
                const unCheckedStationNames = [];
                // 控制state数据
                this.lineData.forEach(line => {
                    const { stationsList, checked, name } = line;
                    if (checked) {
                        lineNames.push(name);
                        stationsList.forEach(station => {
                            stationNames.push(station.name);
                        });
                    } else {
                        unCheckedLineNames.push(name);
                        unCheckedStationNames.forEach(station => {
                            stationNames.push(station.name);
                        });
                    }
                });
                // 控制地图元素
                displayAllByName(lineNames, stationNames, true);
                // 控制地图元素
                displayAllByName(unCheckedLineNames, unCheckedStationNames, false);
            }
        },
        // 设置是否开启全局管理
        disableController(val) {
            this.disable = val;
        },
    },
});
// 由于lineData的state是异步的，所以需要监听action来获取数据
export const watchLineData = (actionName = "setData") => {
    return new Promise((resolve, reject) => {
        // 监听特定的action
        useLineData().$onAction(({ name, store, args, after, onError }) => {
            if (name === actionName) {

                const cb = /*after(callback)在 action 成功执行后调用的回调函数 */
                    (res) => {
                        console.log(res);
                        if (res) {
                            resolve(res);
                        }
                    }
                after(cb);

                onError((e) => {
                    reject(e);
                });
            }
        });
    });
};

export const useMeasureData = defineStore('measureData', {
    state: () => {
        return {
            measureData: []
        }
    },
    getters: {
        // 获取全部信息
        allData() {
            return this.measureData
        }
    },
    actions: {
        setData(data) {
            return new Promise((resolve, reject) => {
                this.measureData = data.length ? data : []
                resolve(data)
            })
        },
        clearData() {
            return new Promise((resolve, reject) => {
                const data = this.measureData.map(item => {
                    item.length && item.forEach(n => n.measures.length = 0)
                    return item
                })
                this.measureData = data
                resolve(data)
            })
        }
    },
})

export const useCommonStore = defineStore("commonData", {
    state: () => {
        return {
            viewer: null,
        };
    },
    //不要调用 getter，直接访问它
    getters: {
        Viewer() {
            return this.viewer;
        },
    },
    actions: {
        setViewer(viewer) {
            this.viewer = viewer;
        },
    }
})