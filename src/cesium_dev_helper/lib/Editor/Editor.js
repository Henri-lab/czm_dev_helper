//Editor 能够 绘制多个实体+存储实体要素
//增加：重置 收集点 数组，并创建新的线实体以准备绘制下一条线。

import EntityDrawer from "./pencil/EntityDrawer";
import mitt from "mitt";

const bus = mitt();
export default class Editor {
    constructor(viewer, $options) {
        console.log('new Editor class')
        this.viewer = viewer;
        this.$entityDrawer = new EntityDrawer(viewer);
        this.$options = $options || {};
        this.currentLine = null;
        this.lines = [];//cache
        this.isDone = false;
    }

    //可以把配置单独传给startLine
    //也可以传给 Editor 
    startLines(options = this.$options.line) {
        let that = this;
        that.isDone = false;
        let $entityDrawer = that.$entityDrawer;
        if (!that.viewer || !that.$options) return;
        // 增加被调用函数的行为
        const pluginFunction = (cb_currentLine, cb_curPosCollection) => {
            that.isDone = true
            that.currentLine = cb_currentLine
            // 将当前绘制完成的线添加到 lines 数组中
            that.lines.push(cb_currentLine);
            // console.log(that.currentLine, 'line done')
            // console.log(cb_curPosCollection, 'line pos')
        }
        $entityDrawer.drawWithEvent('polyline', options, pluginFunction)
    }
    drawback(type, isHide = true) {
        let that = this
        let collection = that.viewer.entities
        let _type = type.toLowerCase()
        if (_type === 'polyline' && that.lines.length) {
            const last = that.lines.pop()
            isHide ? (last.show = false) : collection.remove(last)
            console.log('last line removed')
            return last
        }
    }
}