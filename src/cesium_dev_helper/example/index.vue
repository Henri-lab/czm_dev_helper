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

        </div>
    </div>
</template>
<script setup>
import ExMap from './ExMap/index.vue'
import ExCamera from './ExCamera/index.vue'
import ExEditor from './ExEditor/index.vue'
import ExBuilding from './ExBuilding/index.vue'
import { h, ref, watch } from 'vue';
import {
    MailOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from '@ant-design/icons-vue';


const isEx = ref(false)
const isTest = ref(false)

const theme = ref('dark');
const selectedKeys = ref([]);
const openKeys = ref([]);
const items = ref([
    {
        key: '1',
        icon: () => h(MailOutlined),
        label: '创建地图',
        title: '',
    },
    {
        key: '2',
        icon: () => h(CalendarOutlined),
        label: '相机控制',
        title: '',
    },
    {
        key: '3',
        icon: () => h(AppstoreOutlined),
        label: '画笔工具',
        title: '',
    },
    {
        key: 'sub4',
        icon: () => h(SettingOutlined),
        label: '模型特效',
        title: 'Navigation Four',
        children: [
            {
                key: '/sub4/1',
                label: '楼房坍塌',
                title: '',
            },
            {
                key: '8',
                label: 'Option 8',
                title: 'Option 8',
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
        }
    }
)
</script>

