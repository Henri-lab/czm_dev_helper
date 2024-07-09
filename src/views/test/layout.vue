<!-- 测试用 -->

<!-- 挂载时间在czm-map之后 -->
<template>
  <a-layout>
    <!-- 头部 -->
    <a-layout-header class="header">
      <div class="logo" />
      <!-- 顶部导航栏 -->
      <!-- 双向绑定 -->
      <a-menu
        v-model:selectedKeys="naviHeadKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <!-- 选项 -->
        <a-menu-item
          v-for="item in naviHeadItems"
          :key="item.key"
          :value="item.key"
        >
          {{ item.label }}
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <!-- 内容主体 -->
    <a-layout-content style="padding: 0 50px">
      <!-- 面包屑 -->
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <!-- 左侧菜单栏 -->
        <a-layout-sider width="200" style="background: #fff" v-if="isShow3DMap">
          <a-menu
            v-model:selectedKeys="naviSideKeys"
            v-model:openKeys="openKeys"
            mode="inline"
            style="height: 100%"
          >
            <!-- 子菜单 -->
            <a-sub-menu v-for="submenu in subMenus" :key="submenu.key">
              <template #title>
                <span>
                  <component :is="submenu.icon" />
                  {{ submenu.title }}
                </span>
              </template>
              <!-- 选项 -->
              <a-menu-item v-for="item in submenu.items" :key="item.key">{{
                item.label
              }}</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <!-- 地图容器 -->
        <a-layout-content
          :style="{ padding: '0 24px', minHeight: '280px' }"
          v-if="isShow3DMap"
        >
          <template #default>
            <czm-map></czm-map>
            <uploadVue v-show="isUpload"></uploadVue>
          </template>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <!-- 底部 -->
    <a-layout-footer style="text-align: center">
      Author: henriFox.W 🐱‍👤https://github.com/Henri-lab/metro-cesium
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { watchEffect, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CzmMap, useCommonStore, initModelAt } from '../index';
import { lineConfig } from '../../cesium_dev_helper/_lib/Editor';
import uploadVue from '../../components/test/upload.vue';
import { DataPrepocesser } from '../../cesium_dev_helper/_lib/Data';
import { CameraManager } from '../../cesium_dev_helper/_lib/Manager';
function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}
// pinia
const commonStore = useCommonStore();
// route
const $router = useRouter();
const $route = useRoute();
// menu
const naviHeadKeys = ref([]);
const naviSideKeys = ref([]);
const openKeys = ref([]);
// 页面转换
const isShow3DMap = ref(true);
// 顶部导航栏
const naviHeadItems = [
  { key: '1', label: '主页' },
  { key: '2', label: '三维' },
  { key: '3', label: '二维' },
  { key: '4', label: '其他' },
  { key: '5', label: '其他1' },
  { key: '6', label: '其他2' },
];
// 侧边导航栏
const subMenus = [
  {
    key: 'sub1',
    title: '绘制工具',
    // icon: UserOutlined,
    items: [{ key: '1', label: '线(测试)' }],
  },
  {
    key: 'sub2',
    title: '高级材质',
    items: [{ key: '2', label: 'test' }],
  },
  {
    key: 'sub3',
    title: '场景控制',
    items: [{ key: '3', label: 'test' }],
  },
  {
    key: 'sub4',
    title: '资源加载',
    items: [
      { key: '4', label: '影像图层-武汉(高德)' },
      { key: '5', label: '3DTileset' },
      { key: '6', label: 'GLTF' },
      { key: '7', label: '重置' },
    ],
  },
  {
    key: 'sub5',
    title: '工具箱',
    items: [
      { key: '8', label: '测量' },
      { key: '9', label: '定位' },
      { key: '10', label: '地理分析' },
      { key: '11', label: '物体拖拽' },
    ],
  },
  {
    key: 'sub6',
    title: 'Three集成',
    items: [{ key: '12', label: 'test' }],
  },
  {
    key: 'sub7',
    title: '用户管理',
    items: [
      { key: '13', label: '操作日志' },
      { key: '14', label: '系统配置' },
      { key: '15', label: '权限配置' },
      { key: '16', label: '编码规则' },
    ],
  },
  {
    key: 'sub8',
    title: '测试',
    items: [
      { key: '17', label: '鹰眼控件' },
      { key: '18', label: '反选遮罩' },
    ],
  },
];

const isUpload = ref(false);
onMounted(() => {});

// watch pinia data
let $viewer;
let cM;
watchEffect(() => {
  const viewerFromStore = commonStore.Viewer;
  if (viewerFromStore) {
    $viewer = viewerFromStore;
    cM = new CameraManager(viewerFromStore);
  }
});

let editor;
watchEffect(() => {
  const _editorFromStore = commonStore.Editor;
  if (_editorFromStore) editor = _editorFromStore;
});

//顶部导航的监听
watch(
  () => naviHeadKeys.value,
  (newValue) => {
    switch (newValue[0]) {
      case '1':
        $router.push({ path: '/me', name: 'me' });
        break;
      case '2':
        isShow3DMap.value = true;
        break;
      case '3':
        isShow3DMap.value = false;
        break;
      case '4':
        /* */
        isShow3DMap.value = false;
        break;
      case '5':
        /* */
        isShow3DMap.value = false;
        break;
      case '6':
        /* */
        isShow3DMap.value = false;
        break;
      default:
        isShow3DMap.value = true;
        break;
    }
  }
);
// 侧边导航的监听
watch(
  () => naviSideKeys.value,
  (newValue) => {
    switch (newValue[0]) {
      case '1':
        if (editor) {
          console.log('testing line');
          editor.startLine(lineConfig);
        }
        break;
      case '4':
        // 武汉地图
        commonStore.setMap('wuhan');
        break;
      case '5':
        console.log('testing 3dtileset');
        // 加载示例大楼瓦片-3dtiles
        handleUploadTestModel(
          '/src/mock/3dtiles/Tile_+002_+005/tileset.json',
          '3dtiles'
        );
        break;
      case '6':
        console.log('testing gltf');
        // 加载示例地铁车厢-gltf
        handleUploadTestModel('/src/mock/metro.gltf', 'gltf');
        break;
      case '7':
        // reset 为 全球
        commonStore.setMap('global');
        break;
      default:
        break;
    }
  }
);

const $dP = new DataPrepocesser();
// 上传模型
const handleUploadTestModel = async (url, type) => {
  // 打开上传文件视图
  isUpload.value = true;
  // 一个可以接到加载后model的callback
  const handleLoadedModel = (res) => {
    console.log(`load ${type} successfully`, res);
    if (res) {
      // 调整模型位置
      $dP.update3DtilesMaxtrix(res[0].model, {});
      // 加载好model 关闭上传文件视图
      // 模拟大量数据加载的时间  -- 3s
      setTimeout(() => {
        isUpload.value = false;
      }, 3000);
    }
    // 加载模型后关闭自转
      cM.isRotationEnabled(0);
  };

  // 加载测试数据-3dtiles
  await initModelAt(
    $viewer,
    type,
    {
      url,
      maximumScreenSpaceError: 2,
    },
    handleLoadedModel
  );
};
</script>

<style scoped>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
