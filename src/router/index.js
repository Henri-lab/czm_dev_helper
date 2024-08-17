import { createRouter, createWebHashHistory } from "vue-router";
import { setPermissionGuardExclude } from "./guard/permission";


// const dynamicRoutes = []

const testRoutes = [
  {
    path: '/layout',
    component: () => import('@/layout/index.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
]

const router = createRouter({
  // hash 模式
  history: createWebHashHistory(),
  routes: testRoutes,
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
// setPermissionGuardExclude(router, ['/login', '/register'])

export default router
export const constRoutes = []
export const dynamicRoutes = []
