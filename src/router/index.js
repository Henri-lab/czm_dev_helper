import { createRouter, createWebHashHistory } from "vue-router";
import Me from '@/views/me.vue';
import LayOut from '@/views/layout.vue';


const routes = [
  {
    // 打算放个人简历
    path: "/work",
    name: "work",
    component: LayOut,
  },
  {
    // 打算放个人简历
    path: "/me",
    name: "me",
    component: Me,
  }
];


const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export default router
