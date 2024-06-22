class AnimationManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.clock = viewer.clock;
        this.timeline = viewer.timeline;
    }

    playAnimation() {
        this.clock.shouldAnimate = true;
        this.viewer.timeline.zoomTo(this.clock.startTime, this.clock.stopTime);
    }

    pauseAnimation() {
        this.clock.shouldAnimate = false;
    }

    stopAnimation() {
        this.clock.shouldAnimate = false;
        this.clock.currentTime = this.clock.startTime;
    }

    setPlaybackRate(rate) {
        this.clock.multiplier = rate;
    }

    goToTime(time) {
        const julianDate = Cesium.JulianDate.fromIso8601(time);
        if (Cesium.JulianDate.greaterThan(julianDate, this.clock.startTime) && 
            Cesium.JulianDate.lessThan(julianDate, this.clock.stopTime)) {
            this.clock.currentTime = julianDate;
        }
    }

    saveAnimationState() {
        const state = {
            shouldAnimate: this.clock.shouldAnimate,
            currentTime: this.clock.currentTime.toString(),
            multiplier: this.clock.multiplier
        };
        localStorage.setItem('animationState', JSON.stringify(state));
    }

    loadAnimationState() {
        const state = JSON.parse(localStorage.getItem('animationState'));
        if (state) {
            this.clock.shouldAnimate = state.shouldAnimate;
            this.clock.currentTime = Cesium.JulianDate.fromIso8601(state.currentTime);
            this.clock.multiplier = state.multiplier;
        }
    }

    onAnimationPlay(callback) {
        this.viewer.clock.onTick.addEventListener(() => {
            if (this.clock.shouldAnimate) {
                callback();
            }
        });
    }

    onAnimationPause(callback) {
        this.viewer.clock.onTick.addEventListener(() => {
            if (!this.clock.shouldAnimate && this.clock.currentTime.equals(this.clock.currentTime)) {
                callback();
            }
        });
    }

    onAnimationStop(callback) {
        this.viewer.clock.onTick.addEventListener(() => {
            if (!this.clock.shouldAnimate && this.clock.currentTime.equals(this.clock.startTime)) {
                callback();
            }
        });
    }

    setLoop(loop) {
        this.clock.clockRange = loop ? Cesium.ClockRange.LOOP_STOP : Cesium.ClockRange.CLAMPED;
    }

    addAnimationCallback(time, callback) {
        this.viewer.clock.onTick.addEventListener(() => {
            const currentTime = Cesium.JulianDate.toIso8601(this.clock.currentTime);
            if (currentTime === time) {
                callback();
            }
        });
    }
}

export default AnimationManager;
