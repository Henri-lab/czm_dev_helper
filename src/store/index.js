// 其实喜欢compositionAPI更多 但是选择option API风格，为了更好的兼容vuex习惯;
import { defineStore } from 'pinia'

export const useCommonStore = defineStore("commonData", {
    state: () => {
        return {
            map: '',//type of map
            viewer: null,
            editor: null
        };
    },
    //不要调用 getter，直接访问它
    getters: {
        Map() {
            return this.map;
        },
        Viewer() {
            return this.viewer;
        },
        Editor() {
            return this.editor;
        }
    },
    actions: {
        setMap(type) {
            this.map = type;
        },
        setViewer(viewer) {
            this.viewer = viewer;
        },
        setEditor(editor) {
            this.editor = editor;
        }
    }
})