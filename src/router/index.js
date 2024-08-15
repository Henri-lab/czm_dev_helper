import { createRouter, createWebHashHistory } from "vue-router";
import { setPermissionGuardExclude } from "./guard/permission";
// import MeTest from '@/components/me.vue';
// import CzmMap from '../Map/cesiumMap/CzmMap.vue';
// import LayOut from '@/layout/index.vue'
// import Login from '@/views/login.vue'

// const layOutChildren = [
//   {
//     path: "/me",
//     name: "me",
//     component: MeTest,
//   },
//   {
//     // cesium
//     path: "/czm",
//     name: "czm",
//     component: CzmMap,
//   },
// ]
// const constRoutes = [
//   {
//     path: "/login",
//     component: () => import("@/views/login"),
//     hidden: true,
//   },
//   {
//     path: "/register",
//     component: () => import("@/views/register"),
//     hidden: true,
//   },
//   {
//     path: "/:pathMatch(.*)*",
//     component: () => import("@/views/error/404"),
//     hidden: true,
//   },
//   {
//     path: "/401",
//     component: () => import("@/views/error/401"),
//     hidden: true,
//   },
// ];
// const dynamicRoutes = []


const router = createRouter({
  // hash 模式
  history: createWebHashHistory(),
  routers: [],
  // 保持滚动状态
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});
// 全局守卫
setPermissionGuardExclude(router, ['/login', '/register'])

export default router
