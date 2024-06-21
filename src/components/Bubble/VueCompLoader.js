import PopupCreator from "../../cesiumTools/myFramwork/PopupCreator";
import { getStationInfo } from "@/api/line";



const pathOfVueComponentMap = {
    marker: () => import("./MakerTemplate.vue"),
    carPopup: () => import("./PopupCar.vue"),
    queryPopup: () => import("./PopupQuery.vue"),
};
// VueCompLoader 负责动态加载 目录下的vue组件
class VueCompLoader extends PopupCreator {
    constructor(viewer, options) {
        super(viewer, options, pathOfVueComponentMap, this.showQueryPopup);
    }
    // --天气查询气泡(clickCallback)
    async showQueryPopup() {
        const params = {
            name: this.attr.name,
        };
        const { code, data } = await getStationInfo(params);

        // 查接口数据
        if (code === 200) {
            const address = data.address;
            const peopleFlow = data.peopleFlow;
            const fields = ["名称", "客流量状态", "所属线路", "是否换乘"];
            const values = [
                this.attr.name,
                peopleFlow,
                address,
                this.attr.isChange ? "是" : "否",
            ];

            // 加载气泡
            const opt = {
                position: this.position,
                label: this.attr.name,
                isShow: true,
                color: this.color,
                scaleByDistance: this.scaleByDistance,
                attr: this.attr,
                fields: fields,
                values: values,
                type: "queryPopup",
                offset: [150, -20],
            }
            this.queryPopup = new VueCompLoader(this.viewer, opt);

            // 可视化 挂载元素
            this.queryPopup.addLabel();
        }
    }
    // --移除查询气泡
    removeQueryPopup() {
        this.queryPopup && this.queryPopup.removeMarker()
    }
}

export default VueCompLoader;

