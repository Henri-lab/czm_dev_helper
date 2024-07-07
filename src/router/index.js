import { createRouter, createWebHashHistory } from "vue-router";
import MeTest from '@/views/test/me.vue';
// import LayOutTest from '@/views/test/layout.vue';
import CzmMap from '../views/map/CzmMap.vue';


const routes = [
  {
    // 打算放个人简历
    path: "/me",
    name: "me-test",
    component: MeTest,
  },
  {
    // 默认地图
    path: "/",
    name: "default-map",
    component: CzmMap,
  },
];


const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export default router
