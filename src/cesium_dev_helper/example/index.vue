<template>
    <a-switch :checked="theme === 'dark'" checked-children="Dark" un-checked-children="Light" @change="changeTheme"
        style=" margin-top: 2%;" />

    <div class="doc" style="display: flex; width: 100%;height: 100%;">
        <br />
        <br />
        <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" style="width: 20%" mode="inline"
            :theme="theme" :items="items" />

        <div class="doc-content"
            style="width: 80%;height: 100%; background-color: rgba(24, 24, 23, 0.3); overflow: scroll;">
            <ExMap v-if="isEx == 'map'" />
            <ExCamera v-if="isEx == 'camera'" />
            <ExEditor v-if="isEx == 'editor'" />
            <ExBuilding v-if="isEx == 'building'" />
            <ExPoint v-if="isEx == 'entity:point'" />
            <ExPolygon v-if="isEx == 'entity:polygon'" />
            <ExThree v-if="isEx == 'three'" />
        </div>
    </div>
</template>
<script setup>
import ExMap from './ExMap/index.vue'
import ExCamera from './ExCamera/index.vue'
import ExEditor from './ExEditor/index.vue'
import ExBuilding from './ExBuilding/index.vue'
import ExPoint from './ExPoint/index.vue'
import ExPolygon from './ExPolygon/index.vue'
import ExThree from './ExThree/index.vue'
import { h, ref, watch } from 'vue';

const isEx = ref(false)
const isTest = ref(false)

const theme = ref('dark');
const selectedKeys = ref([]);
const openKeys = ref([]);
const items = ref([
    {
        key: '1',
        label: '创建地图',
        title: '',
    },
    {
        key: '2',
        label: '相机控制',
        title: '',
    },
    {
        key: '3',
        label: '画笔工具',
        title: '',
    },
    {
        key: 'sub4',
        label: '模型/特效',
        title: 'Navigation Four',
        children: [
            {
                key: '/sub4/1',
                label: '楼房坍塌',
                title: '',
            },
            {
                key: '/sub4/2',
                label: '~~',
                title: '',
            },
            {
                key: '9',
                label: 'Option 9',
                title: 'Option 9',
            },
            {
                key: '10',
                label: 'Option 10',
                title: 'Option 10',
            },
        ],
    },
    {
        key: 'sub5',
        label: '动态实体/弹窗/材质',
        title: '',
        children: [
            {
                key: '/sub5/1',
                label: '高性能&弹窗插槽',
                title: '',
            },
            {
                key: '/sub5/2',
                label: '自定义&扩展材质',
                title: '',
            },
            {
                key: '9',
                label: 'Option 9',
                title: 'Option 9',
            },
            {
                key: '10',
                label: 'Option 10',
                title: 'Option 10',
            },
        ],
    },
    {
        key: '6',
        label: 'three',
    }
]);
const changeTheme = (checked) => {
    theme.value = checked ? 'dark' : 'light';
};
watch(() => selectedKeys.value,
    (newV) => {
        if (newV[0] == '1') {
            isEx.value = 'map'
        }
        else if (newV[0] == '2') {
            isEx.value = 'camera'
        } else if (newV[0] == '3') {
            isEx.value = 'editor'
        } else if (newV[0] == '/sub4/1') {
            isEx.value = 'building'
        } else if (newV[0] == '/sub5/1') {
            isEx.value = 'entity:point'
        } else if (newV[0] == '/sub5/2') {
            isEx.value = 'entity:polygon'
        } else if (newV[0] == '6') {
            isEx.value = 'three'
        }
    }
)
</script>

