/**
 * v-hasRole - Vue.js 指令用于处理角色权限。
 * 版权所有 © 2019 ruoyi
 */

// 导入用户状态管理模块
import useUserStore from '@/store/modules/user';

// 导出一个Vue指令
export default {
  // 当元素被插入到 DOM 中时触发
  mounted(el, binding, vnode) {
    // 从绑定中获取角色值
    const { value } = binding;

    // 定义超级管理员角色
    const super_admin = "admin";

    // 从用户状态管理模块获取当前用户的角色列表
    const roles = useUserStore().roles;

    // 检查角色值是否有效
    if (value && value instanceof Array && value.length > 0) {
      // 将角色值存储为数组
      const roleFlags = value;

      // 检查用户是否有至少一个所需的权限
      const hasRole = roles.some(role => {
        // 检查超级管理员角色或所需角色是否包含在用户的角色列表中
        return super_admin === role || roleFlags.includes(role);
      });

      // 如果没有所需的权限，则从 DOM 中移除元素
      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      // 如果未设置角色值，则抛出错误
      throw new Error(`请设置角色权限标签值`);
    }
  }
};