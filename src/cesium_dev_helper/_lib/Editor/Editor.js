//Editor 能够 绘制多个实体+存储实体要素
//增加事件处理程序：每次右键点击后，重置 positions 数组，并创建新的线实体以准备绘制下一条线。

import Draw from "./pencil/Draw";


export default class Editor {
    constructor(viewer, $options) {
        this.viewer = viewer;
        this.$draw = new Draw(viewer);
        this.$options = $options || {};
        this.currentLine = null;
        this.lines = [];//cache
    }

    //可以把配置单独传给startLine
    //也可以传给 Editor 
    startLine(options = this.$options) {
        let that = this;
        let $draw = this.$draw;
        if (!this.viewer || !this.options) return;
        const pluginFunction = (cb_currentLine, cb_curPosCollection) => {
            this.currentLine = cb_currentLine
            // 将当前绘制完成的线添加到 lines 数组中
            that.lines.push(cb_currentLine);
            // 重置 curPosCollection 数组，为下一条线做准备
            cb_curPosCollection = [];
        }
        $draw.drawWithEvent('polyline', options, pluginFunction)
    }
}