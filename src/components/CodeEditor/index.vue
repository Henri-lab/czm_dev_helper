<template>
    <div class="code-editor">
        <textarea ref="codeEditor" style="width: 100%;overflow: scroll;"></textarea>
        <!-- <iframe ref="iframeRef" src="?" style="width: 100%;height: 100%;"></iframe> -->
        <el-button @click="runcode">run code</el-button>
    </div>
</template>

<script>
import { onMounted, watch, ref } from 'vue';
//   import CodeMirror from 'codemirror';
//   import 'codemirror/lib/codemirror.css';
//   import 'codemirror/mode/javascript/javascript';
//   import 'codemirror/mode/htmlmixed/htmlmixed';
//   import 'codemirror/theme/material.css'; // 引入主题 (可选)

export default {
    name: 'CodeEditor',
    props: {
        value: {
            type: String,
            default: ''
        },
        mode: {
            type: String,
            default: 'javascript' // 可以设置为 'htmlmixed', 'css', 等等
        },
        theme: {
            type: String,
            default: 'material'
        }
    },
    emits: ['update:value'],
    setup(props, { emit }) {
        const codeEditor = ref(null); // Vue 3 通过 ref 访问 DOM 元素
        let editor = null;
        function sleep() {
            return new Promise((resolve) => setTimeout(resolve, 0));
        }
        // 监听 value prop 的变化
        watch(
            () => props.value,
            async (newValue) => {
                await sleep()
                if (editor && newValue !== editor.getValue()) {
                    console.log('=================================')
                    editor.setValue(newValue);
                }
            }, {
            immediate: true,
            deep: true,
        }
        );

        let iframeRef = ref();
        function runcode() {
            const iframe = iframeRef.value;
            iframe.style.width = '100%';
            iframe.style.height = '300px';
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write('<h1>Hello World</h1><script>console.log("Hello World")<\/script>');
            iframeDocument.close();
        }

        // 初始化 CodeMirror 编辑器
        onMounted(() => {
            editor = window.CodeMirror.fromTextArea(codeEditor.value, {
                mode: props.mode,
                theme: props.theme,
                lineNumbers: true,
                value: props.value,
            });

            // 监听编辑器内容变化并将其同步到父组件
            editor.on('change', () => {
                const code = editor.getValue();
                emit('update:value', code); // 使用 Vue 3 的事件更新父组件的值
            });
        });

        return {
            codeEditor,
        };
    },
};
</script>

<style scoped>
.code-editor {
    border-top: 2cap solid;
    /* border: 1px solid #08f5f1; */
}

/* v::deep .cm-s-material.CodeMirror {
    height: auto !important;
} */
</style>