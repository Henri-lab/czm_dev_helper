<template>
    <a-card hoverable style="width: 300px">
        <template #cover>
            <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
        </template>
        <template #actions>
            <setting-outlined key="setting" />
            <edit-outlined key="edit" />
            <ellipsis-outlined key="ellipsis" />
        </template>
        <a-card-meta title="Card title" description="This is the description">
            <template #avatar>
                <a-avatar src="https://joeschmoe.io/api/v1/random" />
            </template>
        </a-card-meta>
    </a-card>
</template>
<script lang="ts" setup>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
</script>

