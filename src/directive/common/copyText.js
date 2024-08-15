/**
 * v-copyText - 自定义指令，用于实现文本复制功能。
 */

// 导出一个Vue插件作为指令
export default {
  // 挂载之前
  beforeMount(el, { value, arg }) {
    // 如果参数是 "callback"，则将回调函数存储在元素属性中
    if (arg === "callback") {
      el.$copyCallback = value;
    } else {
      // 否则，存储要复制的文本，并设置点击事件处理器
      el.$copyValue = value;

      // 定义点击事件处理器
      const handler = async () => {
        // 调用复制文本到剪贴板的函数
        const success = await copyTextToClipboard2(el.$copyValue);

        // 如果定义了回调函数，则调用它并传递复制的文本
        if (el.$copyCallback && success) {
          el.$copyCallback(el.$copyValue);
        }
      };

      // 为元素添加点击事件监听器
      el.addEventListener("click", handler);

      // 存储一个方法以在清理时移除事件监听器
      el.$destroyCopy = () => el.removeEventListener("click", handler);
    }
  },
  // 卸载
  unmounted(el) {
    if (el.$destroyCopy) {
      el.$destroyCopy();
    }
  }
};

// 复制文本到剪贴板的函数 使用execCommand 可能带来兼容问题
function copyTextToClipboard(input) {
  // 创建一个文本区域元素来保存文本
  const textarea = document.createElement('textarea');

  // 设置文本区域的值为输入的文本
  textarea.value = input;

  // 防止移动设备上键盘弹出，设置只读属性
  textarea.setAttribute('readonly', '');

  // 样式化文本区域使其隐藏
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';

  // 将文本区域附加到文档
  document.body.appendChild(textarea);

  // 高亮文本区域中的所有文本
  textarea.select();

  // 明确设置 iOS 兼容的选择开始和结束位置
  textarea.selectionStart = 0;
  textarea.selectionEnd = input.length;

  // 尝试复制选定的文本
  let isSuccess = false;
  try {
    isSuccess = document.execCommand('copy');
  } catch (error) {
    console.error('复制文本失败:', error);
  }

  // 移除临时创建的文本区域
  document.body.removeChild(textarea);

  // 返回复制操作是否成功的布尔值
  return isSuccess;
}

// 复制文本到剪贴板的函数
async function copyTextToClipboard2(input) {
  try {
    // 使用 Clipboard API 进行复制
    await navigator.clipboard.writeText(input);
    return true;
  } catch (error) {
    console.error('复制文本失败:', error);
    return false;
  }
}