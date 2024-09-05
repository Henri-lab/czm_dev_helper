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
        </div>
    </div>
</template>
<script setup>
import ExMap from './ExMap/index.vue'
import ExCamera from './ExCamera/index.vue'
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
        key: 'sub1',
        icon: () => h(AppstoreOutlined),
        label: 'Navigation Three',
        title: 'Navigation Three',
        children: [
            {
                key: '3',
                label: 'Option 3',
                title: 'Option 3',
            },
            {
                key: '4',
                label: 'Option 4',
                title: 'Option 4',
            },
            {
                key: 'sub1-2',
                label: 'Submenu',
                title: 'Submenu',
                children: [
                    {
                        key: '5',
                        label: 'Option 5',
                        title: 'Option 5',
                    },
                    {
                        key: '6',
                        label: 'Option 6',
                        title: 'Option 6',
                    },
                ],
            },
        ],
    },
    {
        key: 'sub2',
        icon: () => h(SettingOutlined),
        label: 'Navigation Four',
        title: 'Navigation Four',
        children: [
            {
                key: '7',
                label: 'Option 7',
                title: 'Option 7',
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
            console.log('1');
            isEx.value = 'map'
        }
        else if (newV[0] == '2') {
            isEx.value = 'camera'
        }
    }
)
</script>

