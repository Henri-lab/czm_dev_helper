/**
 * v-hasPermi - 自定义指令用于处理操作权限。
 */

// 导入用户状态管理模块
import useUserStore from '@/store/modules/user';

// 导出一个Vue指令
export default {
  // 当元素被插入到 DOM 中时触发
  mounted(el, binding, vnode) {
    // 从绑定中获取权限值
    const { value } = binding;

    // 定义全权限字符串
    const all_permission = "*:*:*";

    // 从用户状态管理模块获取当前用户的权限列表
    const permissions = useUserStore().permissions;

    // 检查权限值是否有效
    if (value && value instanceof Array && value.length > 0) {
      // 将权限值存储为数组
      const permissionFlags = value;

      // 检查用户是否有至少一个所需的权限
      const hasPermissions = permissions.some(permission => {
        // 检查全权限或所需权限是否包含在用户的权限列表中
        return all_permission === permission || permissionFlags.includes(permission);
      });

      // 如果没有所需的权限，则从 DOM 中移除元素
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      // 如果未设置权限值，则抛出错误
      throw new Error(`请设置操作权限标签值`);
    }
  }
};