// 其实喜欢compositionAPI更多 但是选择option API风格，为了更好的兼容vuex习惯;
// 这里的map指的是map type 是一个字符串 而不是czm相关的map对象 
import { defineStore } from 'pinia'

export default defineStore('defaultStore', {
    state: () => {
        return {
            map: '', // type of map 
            mapInfo: {},
            viewer: null,
            editor: null,
            // 检测变化次数
            mapUpdatedCount: 0,
            viewerUpdatedCount: 0,
            editorUpdatedCount: 0,
        };
    },
    getters: {
        Map: state => state.map,
        MapInfo: state => state.mapInfo,
        Viewer: state => state.viewer,
        Editor: state => state.editor,
        MapUpdatedCount: state => state.mapUpdatedCount,
        ViewerUpdatedCount: state => state.viewerUpdatedCount,
        EditorUpdatedCount: state => state.editorUpdatedCount
    },
    actions: {
        setMap(type) {
            this.map = type;
            this.mapUpdatedCount++;
        },
        setViewer(viewer) {
            this.viewer = viewer;
            this.viewerUpdatedCount++;
        },
        setEditor(editor) {
            this.editor = editor;
            this.editorUpdatedd++;
        },
    }
});