//Editor 能够 绘制多个实体+存储实体要素
//增加：重置 收集点 数组，并创建新的线实体以准备绘制下一条线。

import EntityDrawer from "./pencil/EntityDrawer";
import { LayerManager } from "../Manager";

export default class Editor {
    constructor(viewer, $options) {
        console.log('new Editor class')
        this.viewer = viewer;
        this.$entityDrawer = new EntityDrawer(viewer);
        this.$options = $options || {};
        this.currentLine = null;
        this.lines = [];//cache
        this.linesTrash = [];
        this.isDone = false;
    }

    //可以把配置单独传给startLine
    //也可以传给 Editor 
    startLines(options = this.$options.line) {
        let that = this;
        that.isDone = false;
        let $entityDrawer = that.$entityDrawer;
        $entityDrawer.removeEventHandler();
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
    drawback(type, isHide) {
        let that = this
        let _type = type.toLowerCase()
        if (_type === 'polyline' && that.lines.length) {
            const last = that.lines.pop()
            that.linesTrash.push(last)
            let source = LayerManager.getOwnerOfEntity(last)
            isHide === 'hide' ? (last.show = false) : source.entities.remove(last)
            console.log('last line removed , id:', last.id, 'from', source.entities.values)
            return last
        }
    }

    recover(type) {
        let that = this
        let _type = type.toLowerCase()
        if (_type === 'polyline' && that.linesTrash.length) {
            const last = that.linesTrash.pop()
            let source = LayerManager.getOwnerOfEntity(last)
            source.entities.add(last)
            that.lines.push(last)
            console.log('last line recovered , id:', last.id)
            return last
        }
    }
}