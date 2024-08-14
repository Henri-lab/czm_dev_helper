import { createRouter, createWebHashHistory } from "vue-router";
import MeTest from '@/components/me.vue';
// import LayOutTest from '@/views/test/layout.vue';
import CzmMap from '../Map/cesiumMap/CzmMap.vue';
import LayOut from '@/layout/index.vue'
import Login from '@/views/login.vue'

const layOutChildren = [
  {
    path: "/me",
    name: "me",
    component: MeTest,
  },
  {
    // cesium
    path: "/czm",
    name: "czm",
    component: CzmMap,
  },
  // {
  //   // openlayer
  //   path: "/ol",
  //   name: "ol",
  //   component: CzmMap,
  // },
]
const constRoutes = [
  {
    // 登录界面
    path: "/",
    name: "home",
    component: Login,
  },
];
const dynamicRoutes = []


const router = createRouter({
  // hash 模式
  history: createWebHashHistory(),
  routers: constRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router
