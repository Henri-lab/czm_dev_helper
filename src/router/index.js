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
const commonRoutes = [
  {
    // 登录界面
    path: "/",
    name: "home",
    component: Login,
  },
];


const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  commonRoutes, // `routes: routes` 的缩写
});

export default router
