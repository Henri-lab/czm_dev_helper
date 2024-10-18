<template>
    <div class="code-editor">
        <textarea ref="codeEditor"></textarea>
    </div>
</template>

<script>
// import CodeMirror from 'codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/mode/htmlmixed/htmlmixed';
// import 'codemirror/theme/material.css'; // 引入主题 (可选)

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
    watch: {
        value(newValue) {
            if (this.editor && newValue !== this.editor.getValue()) {
                this.editor.setValue(newValue);
            }
        }
    },
    mounted() {
        async function importCodeMirror() {
            const CodeMirror = await import('codemirror');
            require('codemirror/lib/codemirror.css');
            require('codemirror/mode/javascript/javascript');
            require('codemirror/mode/htmlmixed/htmlmixed');
            require('codemirror/theme/material.css');
        }
        importCodeMirror();

        this.editor = CodeMirror.fromTextArea(this.$refs.codeEditor, {
            mode: this.mode,
            theme: this.theme,
            lineNumbers: true,
            value: this.value
        });

        this.editor.on('change', () => {
            const code = this.editor.getValue();
            this.$emit('input', code); // 将编辑器的值传递回父组件
        });
    }
};
</script>

<style scoped>
.code-editor {
    border: 1px solid #ccc;
    height: 300px;
}
</style>
