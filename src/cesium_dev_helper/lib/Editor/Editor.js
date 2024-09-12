//Editor 能够 绘制多个实体+存储实体要素
//增加：重置 收集点 数组，并创建新的线实体以准备绘制下一条线。

import EntityDrawer from "./pencil/EntityDrawer";
import { LayerManager } from "../Manager";
import { lineOpt, polygonOpt } from './config/lineOpt'

export default class Editor {
    constructor(viewer, $options) {
        console.log('new Editor class')
        this.viewer = viewer;
        this.$entityDrawer = new EntityDrawer(viewer);
        this.$options = $options || {
            line: lineOpt,
            polygon: polygonOpt
        };
        this.currentLine = null;
        this.lines = [];//cache
        this.linesTrash = [];
        this.currentPolygon = null;
        this.polygons = [];
        this.polygonTrash = [];
    }

    //可以把配置单独传给startLine
    //也可以传给 Editor 
    startLines(options = this.$options.line) {
        let that = this;
        let $entityDrawer = that.$entityDrawer;
        $entityDrawer.removeEventHandler();
        if (!that.viewer || !that.$options) return;
        const pluginFunction = (_currentLine, _curPosCollection) => {
            that.currentLine = _currentLine
            that.lines.push(_currentLine);
        }
        $entityDrawer.drawWithEvent('polyline', options, pluginFunction)
    }
    startPolygons(options = this.$options.polygon) {
        let that = this;
        let $entityDrawer = that.$entityDrawer;
        $entityDrawer.removeEventHandler();
        if (!that.viewer || !that.$options) return;
        const pluginFunction = (_currentPolygon, _curPosCollection) => {
            that.currentPolygon = _currentPolygon
            that.polygons.push(_currentPolygon);
        }
        $entityDrawer.drawWithEvent('polygon', options, pluginFunction)
    }
    drawback(type, isHide) {
        let that = this
        let _type = type.toLowerCase()
        if (_type === 'polyline' && that.lines.length) {
            const last = that.lines.pop()
            that.linesTrash.push(last)
            let source = LayerManager.getOwnerOfEntity(last)
            isHide === 'hide' ? (last.show = false) : source.entities.remove(last)
            // console.log('last line removed , id:', last.id, 'from', source.entities.values)
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