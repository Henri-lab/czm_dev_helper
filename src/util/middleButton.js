// 获取元素
const button = document.getElementById('myMiddleButton');

// 添加键盘监听事件，按下 'M' 键模拟鼠标中键点击
document.addEventListener('keydown', function (event) {
    if (event.key === 'm' || event.key === 'M') { // 'M' 键触发中键模拟
        simulateMiddleClick(button);
    }
});

// 添加右键点击事件处理函数
button.addEventListener('auxclick', function (event) {
    if (event.button === 1) {  // 检查是否是中键
        alert('Middle mouse button clicked or simulated with keyboard!');
    }
});

// 模拟鼠标中键点击的函数
function simulateMiddleClick(element) {
    const middleClickEvent = new MouseEvent('auxclick', {
        bubbles: true,      // 事件是否冒泡
        cancelable: true,   // 是否可以取消
        view: window,       // 事件的视图
        button: 1           // 1 代表鼠标中键
    });

    // 在指定元素上派发该事件
    element.dispatchEvent(middleClickEvent);
}


// 在 JavaScript 中，auxclick 事件是一个专门用于捕获辅助鼠标按钮点击的事件，它可以检测鼠标的中键（通常是滚轮点击）和其他辅助按钮（例如侧边按钮）。
// 这是浏览器较新的一种事件类型，相对于 click 事件更加具体，因为 click 通常只用于左键单击，而 auxclick 可处理非左键的点击操作。

// 1. auxclick 的工作原理
// 鼠标中键（滚轮）点击：auxclick 能够捕获鼠标中键的点击。
// 鼠标其他辅助按钮点击：例如，某些鼠标会有额外的前进或后退按钮，这些按钮的点击也会触发 auxclick 事件。
// 2. 如何使用 auxclick
// auxclick 事件的回调函数接收到一个 MouseEvent 对象，包含有关鼠标点击的详细信息，例如是哪个按钮（左键、右键、中键等）被点击了。

// event.button: 指示点击的按钮类型。
// 0：表示鼠标左键（但通常不会触发 auxclick，左键点击通常触发 click）。
// 1：表示鼠标中键。
// 2：表示鼠标右键。
