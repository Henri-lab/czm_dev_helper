/**
 * v-draggable - Vue.js 指令用于拖拽展示型组件。
 */

export default {
  //@hf
  mounted(el, binding) {
    // 扩展指令的功能
    // binding参数包含了与指令相关的信息，如value、arg、modifiers等
    let startX = 0;
    let startY = 0;
    let initialMouseX = 0;
    let initialMouseY = 0;
    let dragging = false;

    const mouseDownHandler = (e) => {
      if (dragging) return;
      dragging = true;
      initialMouseX = e.clientX;
      initialMouseY = e.clientY;
      startX = parseFloat(el.style.left || 0);
      startY = parseFloat(el.style.top || 0);

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e) => {
      if (!dragging) return;
      const dx = e.clientX - initialMouseX;
      const dy = e.clientY - initialMouseY;
      const maxLeft = window.innerWidth - el.offsetWidth;
      const maxTop = window.innerHeight - el.offsetHeight;

      // 限制元素在窗口内移动
      // el.style.left = `${Math.max(0, Math.min(maxLeft, startX + dx))}px`;
      // el.style.top = `${Math.max(0, Math.min(maxTop, startY + dy))}px`;
      // 不限制
      el.style.left = `${maxLeft, startX + dx}px`;
      el.style.top = `${maxTop, startY + dy}px`;
    };

    const mouseUpHandler = () => {
      dragging = false;
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    el.addEventListener('mousedown', mouseDownHandler);

    // 存储清理函数
    const cleanup = () => {
      el.removeEventListener('mousedown', mouseDownHandler);
    };

    // 确保在组件卸载时清理
    el.__cleanup__ = cleanup;
  },
  unmounted(el) {
    if (el.__cleanup__) {
      el.__cleanup__();
    }
  }
};

