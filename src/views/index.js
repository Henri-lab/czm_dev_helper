import initViewerAt from '../util/initViewerAt';
import { useCommonStore } from '../store';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
} from '@ant-design/icons-vue';
import CzmMap from './map/CzmMap.vue';
import Draw from '../cesium_dev_helper/czmHelper/Editor/pencil/Draw';

// const commonStore = useCommonStore();需要在組件中創建

export {
    Draw,
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    CzmMap,
    useCommonStore,
    initViewerAt,
    useRoute,
    useRouter,
    onMounted,
    ref,
    watch,
}