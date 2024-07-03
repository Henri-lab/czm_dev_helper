//Editor 能够 绘制多个实体+存储实体要素
//增加事件处理程序：每次右键点击后，重置 positions 数组，并创建新的线实体以准备绘制下一条线。

import Draw from "./pencil/Draw";


export default class Editor {
    constructor(viewer) {
        this.viewer = viewer;
        this.$draw = new Draw(viewer);
        this.options = options || {};
        this.currentLine = null;
        this.lines = [];//cache
    }

    startLine(options) {
        let that = this;
        if (!this.viewer || !this.options) return;
        const pluginFunction = (currentLine, positions) => {
            // 将当前绘制完成的线添加到 lines 数组中
            that.lines.push($this.currentLine);
            // 重置 positions 数组，为下一条线做准备
            positions = [];
        }
        this.$draw.LineWithEvent(options, pluginFunction)
    }
}