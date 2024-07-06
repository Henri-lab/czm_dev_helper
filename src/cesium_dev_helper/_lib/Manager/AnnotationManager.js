import Manager from "./Manager";
import * as Cesium from "cesium";

// let Cesium = new Manager().Cesium;

class AnnotationManager extends Manager {
    constructor(viewer) {
        super(viewer);
        this.annotations = [];
    }

    addAnnotation(position, text, options = {}) {
        const annotation = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height || 0),
            label: {
                text: text,
                font: options.font || '14pt sans-serif',
                fillColor: options.fillColor || Cesium.Color.WHITE,
                outlineColor: options.outlineColor || Cesium.Color.BLACK,
                outlineWidth: options.outlineWidth || 1,
                style: options.style || Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: options.verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: options.pixelOffset || new Cesium.Cartesian2(0, -15),
                backgroundColor: options.backgroundColor || Cesium.Color.TRANSPARENT,
                showBackground: options.showBackground || false,
                scale: options.scale || 1.0,
                translucencyByDistance: options.translucencyByDistance || undefined,
                distanceDisplayCondition: options.distanceDisplayCondition || undefined
            }
        });
        this.annotations.push(annotation);
        return annotation;
    }

    removeAnnotation(annotation) {
        this.viewer.entities.remove(annotation);
        this.annotations = this.annotations.filter(a => a !== annotation);
    }

    updateAnnotation(annotation, newPosition, newText, newOptions = {}) {
        annotation.position = Cesium.Cartesian3.fromDegrees(newPosition.longitude, newPosition.latitude, newPosition.height || 0);
        annotation.label.text = newText;
        Object.assign(annotation.label, newOptions);
    }

    getAnnotations() {
        return this.annotations;
    }

    clearAnnotations() {
        this.annotations.forEach(annotation => this.viewer.entities.remove(annotation));
        this.annotations = [];
    }

    // 事件监听
    // 获取点击的annotation
    addClickListener(annotation, callback) {
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((movement) => {
            const pickedObject = this.viewer.scene.pick(movement.position);
            if (Cesium.defined(pickedObject) && pickedObject.id === annotation) {
                callback(annotation);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        return handler;
    }

    // 持久化
    saveAnnotations() {
        const savedData = this.annotations.map(annotation => ({
            position: Cesium.Cartographic.fromCartesian(annotation.position.getValue(Cesium.JulianDate.now())),
            text: annotation.label.text.getValue(Cesium.JulianDate.now()),
            options: {
                font: annotation.label.font,
                fillColor: annotation.label.fillColor,
                outlineColor: annotation.label.outlineColor,
                outlineWidth: annotation.label.outlineWidth,
                style: annotation.label.style,
                verticalOrigin: annotation.label.verticalOrigin,
                pixelOffset: annotation.label.pixelOffset,
                backgroundColor: annotation.label.backgroundColor,
                showBackground: annotation.label.showBackground,
                scale: annotation.label.scale,
                translucencyByDistance: annotation.label.translucencyByDistance,
                distanceDisplayCondition: annotation.label.distanceDisplayCondition
            }
        }));
        localStorage.setItem('annotations', JSON.stringify(savedData));
    }

    loadAnnotations() {
        const savedData = JSON.parse(localStorage.getItem('annotations')) || [];
        savedData.forEach(data => {
            this.addAnnotation(
                {
                    longitude: Cesium.Math.toDegrees(data.position.longitude),
                    latitude: Cesium.Math.toDegrees(data.position.latitude),
                    height: data.position.height
                },
                data.text,
                data.options
            );
        });
    }
}

export default AnnotationManager;
