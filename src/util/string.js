// 字符串格式化( %s )
// 示例
// const message = "用户 %s 已成功登录系统。";
// const username = "张三";
// console.log(sprintf(message, username)); // 输出: 用户 张三 已成功登录系统。
export function sprintf(str) {
    let args = arguments, flag = true, i = 1;
    str = str.replace(/%s/g, function () {
        let arg = args[i++];
        if (typeof arg === 'undefined') {
            flag = false;
            return '';
        }
        return arg;
    });
    return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}




