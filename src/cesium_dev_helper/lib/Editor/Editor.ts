//Editor 能够 绘制多个实体+存储实体要素
//增加：重置 收集点 数组，并创建新的线实体以准备绘制下一条线。
import * as Cesium from 'cesium';
import EntityDrawer from "./pencil/EntityDrawer";
import { LayerManager } from "../Manager";
import { lineOpt, polygonOpt } from './config/lineOpt'

export default class Editor {
    constructor(viewer:Cesium.Viewer, $options) {
        console.log('new Editor class')
        this.viewer = viewer;
        this.$entityDrawer = new EntityDrawer(viewer);
        this.$options = $options || {
            polyline: lineOpt,
            polygon: polygonOpt
        };
        this.currentLine = null;
        this.lines = [];//cache
        this.linesTrash = [];
        this.currentPolygon = null;
        this.polygons = [];
        this.polygonTrash = [];
    }

    start(type, options) {
        let that = this;
        let _type = type.toLowerCase();
        let _options = options || this.$options[_type]
        let $entityDrawer = that.$entityDrawer;
        $entityDrawer.removeEventHandler();
        if (!that.viewer || !that.$options) return;
        const pluginFunction = (_current, _curPosCollection) => {
            if (_type === 'polyline') {
                that.currentLine = _current
                that.lines.push(_current);
            } else if (_type === 'polygon') {
                that.currentPolygon = _current
                that.polygons.push(_current);
            }
        }
        $entityDrawer.drawWithDefaultEvent(_type, _options, pluginFunction)
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