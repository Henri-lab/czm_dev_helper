/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2023-09-22 11:37:31
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 15:03:06
 */
import { createRouter, createWebHashHistory } from "vue-router";
import Me from '@/views/me.vue';
import LayOut from '@/views/layout.vue';

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。

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

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export default router
