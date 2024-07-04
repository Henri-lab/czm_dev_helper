import { render, createVNode } from "vue";
import * as Cesium from "cesium";


// 示例
// const pathOfVueComponentMap = {
//     marker: () => import("./MakerTemplate.vue"),
//     carPopup: () => import("./PopupCar.vue"),
//     queryPopup: () => import("./PopupQuery.vue"),
// };

/**
 * A class for creating and managing custom object popups in a Cesium application.
 * @class
 */

class PopupCreator {
    constructor(viewer, options, pathOfVueComponentMap, clickHandler) {
        this.viewer = viewer;
        this.position = Cesium.defaultValue(
            options.position,
            Cesium.Cartesian3.ZERO
        );
        this.label = Cesium.defaultValue(options.label, "label");
        this.isShow = Cesium.defaultValue(options.isShow, true);
        this.color = Cesium.defaultValue(options.color, "#ff0000");
        this.fields = Cesium.defaultValue(options.fields, []);
        this.values = Cesium.defaultValue(options.values, []);
        this.attr = Cesium.defaultValue(options.attr, {});
        this.popupType = Cesium.defaultValue(options.type, "marker");
        this.offset = Cesium.defaultValue(options.offset, [0, 0]);
        this.popupRoutes = pathOfVueComponentMap
        this.queryPopup = null;
        this.isDisplay = true;
        this.mountNode = null;
        // 当相机距离标签 1000 米或更近时，标签的缩放比例为 1；当相机距离标签 20000 米或更远时，标签的缩放比例为 0.4；在这两个距离之间的缩放比例会线性变化。
        this.scaleByDistance = Cesium.defaultValue(
            options.scaleByDistance,
            new Cesium.NearFarScalar(1000, 1, 20000, 0.4)
        );
        // 点击popup的回调
        this.clickHandler = clickHandler;
    }

    // 手动根据距离计算显示级别
    // tip:如果是czm管理的对象，那么对Cesium.NearFarScalar对象会自动处理尺度运算;
    calcaluteGrade(curValue, stdNearFar) {
        let curPara = 0;
        if (curValue <= stdNearFar.near) {
            curPara = stdNearFar.nearValue;
        } else if (curValue >= stdNearFar.far) {
            curPara = stdNearFar.farValue;
        } else {
            // total=far-near
            const totalGrade = Math.ceil(
                Math.log(stdNearFar.far / stdNearFar.near) / Math.log(2)
            );
            // delta=cur-near
            const curGrade = Math.round(
                Math.log(curValue / stdNearFar.near) / Math.log(2)
            );
            // percent=(delta/total)
            // near+ (percent*total)
            curPara =
                stdNearFar.nearValue +
                ((stdNearFar.farValue - stdNearFar.nearValue) * curGrade) / totalGrade;
        }
        return curPara;
    }


    //场景渲染事件 实时更新标签的位置 使其与笛卡尔坐标一致
    postRender() {
        if (!this.vmInstance.el || !this.vmInstance.el.style) return;
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        // 地理坐标转屏幕坐标
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.viewer.scene,
            this.position,
            windowPosition
        );
        this.vmInstance.el.style.bottom =
            canvasHeight - windowPosition.y + this.offset[1] + "px";
        const elWidth = this.vmInstance.el.offsetWidth;
        this.vmInstance.el.style.left =
            windowPosition.x - elWidth / 2 + this.offset[0] + "px";

        // 处理近大远小效果
        const cameraHeight = Math.ceil(
            this.viewer.camera.positionCartographic.height
        );
        const scaleSize = this.calcaluteGrade(cameraHeight, this.scaleByDistance);
        this.vmInstance.el.style.transform = `scale(${scaleSize},${scaleSize})`;

        // 只有当显示模式打开的时候，才进行优化
        if (this.isDisplay) {
            const condition1 =
                windowPosition.y < 0 || windowPosition.y > canvasHeight;
            const condition2 = this.viewer.camera.positionCartographic.height > 12000;
            const condition3 =
                windowPosition.x < 0 ||
                windowPosition.x > this.viewer.scene.canvas.width;
            if (condition1 || condition2 || condition3) {
                this.vmInstance.el.style.display = "none";
            } else {
                this.vmInstance.el.style.display = "block";
            }
        }
    }
    //添加场景事件
    addPostRender() {
        this.viewer.scene.postRender.addEventListener(this.postRender, this/* 'this' of 'this.postRender' is this*/);
    }

    // 挂载HTML元素 label
    async addLabel(type, options = {}) {
        if (!this.popupRoutes[type]) {
            return null;
        }
        const res = await this.popupRoutes[type]();
        // 组件形成虚拟DOM
        const vmInstance = createVNode(res.default/*组件本身*/, {
            /*props*/
            label: this.label,
            color: this.color,
            position: this.position,
            attr: this.attr,
            clickCallback: () => {
                this.clickHandler();
            },
            closePopup: () => {
                this.removeMarker();
            },
            fields: this.fields,
            values: this.values,
        });
        // 渲染为真实DOM
        const mountNode = document.createElement("div");
        render(vmInstance, mountNode);
        // 挂载在czm控件
        this.viewer.cesiumWidget.container.appendChild(mountNode);
        this.addPostRender();
        vmInstance.el.style.display = options.isShow ? "block" : "none";
        return vmInstance.el;
    }

    // 移除HTML元素 
    removeMarker() {
        this.mountNode &&
            this.viewer.cesiumWidget.container.removeChild(this.mountNode); //删除DOM
        this.viewer.scene.postRender.removeEventListener(this.postRender, this); //移除事件监听
        this.mountNode = null;
    }

}

export default PopupCreator;


