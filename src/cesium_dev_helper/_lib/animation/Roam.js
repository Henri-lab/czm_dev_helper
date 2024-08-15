import * as Cesium from "cesium";
import { Graphics } from '../Editor'
import { LayerManager } from "../Manager";

export default class Roam {
    constructor(viewer, positions, {
        speed,
        startTime,
        stopTime,
        currentTime,
        clockRange,
        multiplier,
        datasource,
    }) {
        if (!viewer) return;
        this.viewer = viewer;
        this.datasource = datasource || new LayerManager(viewer).getOrCreateDatasourceByName('metroLayer@henriFox');
        this.$graphics = new Graphics(viewer);
        // 核心数据
        this.data.positions = positions;
        this.data.speed = speed || 1;
        this.data.startTime = startTime || Cesium.JulianDate.now();
        this.data.stopTime = stopTime || Cesium.JulianDate.addSeconds(this.startTime, this.positions.length / this.speed, new Cesium.JulianDate());
        this.data.currentTime = currentTime || this.startTime.clone();
        this.data.clockRange = clockRange || Cesium.ClockRange.LOOP_STOP;
        this.data.multiplier = multiplier || 1;
        // 设置clock对象
        this._setClock();

    }
    _setClock() {
        const clock = this.viewer.clock;
        clock.startTime = this.data.startTime.clone();
        clock.stopTime = this.data.stopTime.clone();
        clock.currentTime = this.data.currentTime.clone();
        clock.clockRange = this.data.clockRange;
        clock.multiplier = this.data.multiplier
        // 时间跳转
        this.viewer.timeline.zoomTo(this.data.startTime, this.data.stopTime);
    }

    _start() {
        this.viewer.clock.currentTime = this.startTime.clone();
        this.viewer.clock.shouldAnimate = true;
    }

    _pause() {
        this.viewer.clock.shouldAnimate = false;
    }

    _resume() {
        this.viewer.clock.shouldAnimate = true;
    }

    _reset() {
        this.viewer.clock.currentTime = this.startTime.clone();
        this.viewer.clock.shouldAnimate = false;
    }

    _destroy() {
        this.viewer.entities.remove(this.carEntity);
    }
    /**
    * Initializes a car entity with given model and path options.
    *
    * @param {Object} modelOptions - options for the car model.
    * @param {String} modelOptions.uri - the source of the car model
    * @param {Object} pathOptions - options for the car path.
    * @param {Object} extraOptions - Additional options for the car Entity
    * @returns {undefined}
    */
    initCar(modelOptions, pathOptions, extraOptions) {
        const { positions, startTime, speed } = this.data,
            datasource = this.datasource

        const cfg = {
            extraOptions,
            options: {
                positions,
                startTime,
                speed,
                ...modelOptions,
                ...pathOptions
            },
            datasource,
        }
        this.$graphics.createAdvancedEntity('sample', cfg);
    }
    /**
     * Executes a specific action based on the given order.
     *
     * @param {string} order - The action to be performed. It can be one of the following:
     * - 'start': Starts the animation.
     * - 'pause': Pauses the animation.
     * - 'resume': Resumes the animation.
     * - 'reset': Resets the animation to the start time.
     * - 'destroy': Destroys the car entity.
     *
     * @returns {undefined}
     */

    driverToDo(order) {
        switch (order.toLowerCase()) {
            case 'start':
                this._start();
                break;
            case 'pause':
                this._pause();
                break;
            case 'resume':
                this._resume();
                break;
            case 'reset':
                this._reset();
                break;
            case 'destroy':
                this._destroy();
                break;
            default:
                console.error(`Invalid order: ${order}`);
                break;
        }
    }

}

