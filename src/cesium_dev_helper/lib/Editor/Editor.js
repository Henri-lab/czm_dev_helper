//Editor 能够 绘制多个实体+存储实体要素
//增加：重置 收集点 数组，并创建新的线实体以准备绘制下一条线。

import EntityDrawer from "./pencil/EntityDrawer";


export default class Editor {
    constructor(viewer, $options) {
        console.log('new Editor class')
        this.viewer = viewer;
        this.$entityDrawer = new EntityDrawer(viewer);
        this.$options = $options || {};
        this.currentLine = null;
        this.lines = [];//cache
        this.index = 0;
    }

    //可以把配置单独传给startLine
    //也可以传给 Editor 
    startLine(options = this.$options.line) {
        let that = this;
        let $entityDrawer = that.$entityDrawer;
        if (!that.viewer || !that.$options) return;
        // 增加被调用函数的行为
        const pluginFunction = (cb_currentLine, cb_curPosCollection) => {
            that.currentLine = cb_currentLine
            // 将当前绘制完成的线添加到 lines 数组中
            that.lines.push(cb_currentLine);
            // 重置 curPosCollection 数组，为下一条线做准备
            cb_curPosCollection = [];
        }
        $entityDrawer.drawWithEvent('polyline', options, pluginFunction)
        // TEST
        console.log('start a Line' + that.index++);
    }
}