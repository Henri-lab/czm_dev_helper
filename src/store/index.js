// 其实喜欢compositionAPI更多 但是选择option API风格，为了更好的兼容vuex习惯;
// 这里的map指的是map type 是一个字符串 而不是czm相关的map对象 
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('commonData', {
    state: () => {
        return {
            map: '', // type of map 
            viewer: null,
            editor: null,
            // 检测变化标志
            mapUpdated: false,
            viewerUpdated: false,
            editorUpdated: false
        };
    },
    getters: {
        Map: state => state.map,
        Viewer: state => state.viewer,
        Editor: state => state.editor,
        isMapUpdated: state => state.mapUpdated,
        isViewerUpdated: state => state.viewerUpdated,
        isEditorUpdated: state => state.editorUpdated
    },
    actions: {
        setMap(type) {
            this.map = type;
            this.mapUpdated = !this.mapUpdated;
        },
        setViewer(viewer) {
            this.viewer = viewer;
            this.viewerUpdated = !this.viewerUpdated;
        },
        setEditor(editor) {
            this.editor = editor;
            this.editorUpdated = !this.editorUpdated;
        },
    }
});