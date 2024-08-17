import { defineStore } from 'pinia'

export const useCommonStore = defineStore('czmMapData', {
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