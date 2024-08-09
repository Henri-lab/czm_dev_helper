// interface dict { 🔆
//     value: String
//     label: String
// }


// 回显数据字典（字符串数组）
// 导出一个函数，用于根据提供的值从数据集中选择对应的标签
// 示例
// const dict = [
//     { value: '1', label: '管理员' },
//     { value: '2', label: '普通用户' }
// ];

// const selectedRoles = ['1', '2'];

// const labels = selectDictLabels(dict, selectedRoles, ',');

// console.log(labels); // 输出 "管理员,普通用户"  (String)
export function selectDictLabels(dict, value, separator) {
    // 如果value未定义或为空字符串，则直接返回空字符串
    if (value === undefined || value.length === 0) {
        return "";
    }

    // 如果strArr是一个数组，则将其转换为逗号分隔的字符串
    if (Array.isArray(value)) {
        value = value.join(",");
    }

    // 初始化actions数组，用于存储匹配到的标签以及分隔符
    let actions = [];

    // 确定分隔符，默认为逗号
    let currentSeparator = separator === undefined ? "," : separator;

    // 将str按照分隔符进行分割
    let temp = value.split(currentSeparator);

    // 遍历分割后的值
    Object.keys(temp).some((val, index) => {
        // 初始化匹配标志
        let match = false;

        // 在数据集中查找匹配的项
        Object.keys(dict).some((key) => {
            // 比较当前值与数据集中的value是否匹配
            if (dict[key].value === ('' + temp[val])) {
                // 如果匹配成功，则将标签和分隔符添加到actions数组
                actions.push(dict[key].label + currentSeparator);
                match = true;
            }
        });

        // 如果没有找到匹配项，则将当前值和分隔符直接添加到actions数组
        if (!match) {
            actions.push(temp[val] + currentSeparator);
        }
    })

    // 返回去掉最后一个分隔符的标签字符串
    return actions.join('').substring(0, actions.join('').length - 1);
}

// 回显数据字典
export function selectDictLabel(dict, value) {
    if (value === undefined) {
        return "";
    }
    let actions = [];
    Object.keys(dict).some((key) => {
        if (dict[key].value == ('' + value)) {
            actions.push(dict[key].label);
            return true;
        }
    })
    // 没有匹配的 将原数据展示
    if (actions.length === 0) {
        actions.push(value);
    }
    return actions.join('');
}
