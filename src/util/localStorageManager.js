const removeLocalStorageItemsByPrefix = (prefix) => {
    // 从后往前遍历以避免索引问题💥  
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    }
};

let countID = 0;
function ensureId(obj, IDtype) {
    if (!obj.hasOwnProperty('id')) {
        if (IDtype === 'timestamp') obj.id = Date.now();
        else if (IDtype === 'count') obj.id = countID++;
        else if (IDtype === 'random') obj.id = Math.random();
        else if (IDtype === 'uuid') {
            // UUID的使用
            let uuidv4;
            try {
                uuidv4 = require('uuid').v4;
            } catch (error) {
                console.error('你正在使用UUID生成id,但是检测到您并没有安装 uuid 模块');
            }
            obj.id = uuidv4();
        }
        else obj.id = countID++;
    }
    return obj;
}

const setLocalStorageItems = (prefix, sourceArr = [], IDtype) => {
    // 先删除所有以指定前缀开头的项  
    removeLocalStorageItemsByPrefix(prefix);
    // 存储新的项  
    sourceArr.forEach(obj => {
        // 修改原有元素的属性
        const newItem = ensureId(obj, IDtype);
        const key = prefix + newItem.id;
        const value = JSON.stringify(newItem);
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Error setting item with key ${key}`, error);
        }
    });
};

const getLocalStorageItemsByPrefix = (prefix, resultArr = []) => {
    // 初始化resultArray作为参数，避免外部arr的副作用  
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            const id = key.substring(prefix.length);
            try {
                const item = JSON.parse(localStorage.getItem(key));
                // bug🚩
                if (!resultArr.some(obj => obj.id === id)) {
                    resultArr.push(item);
                }
            } catch (error) {
                console.error(`Error parsing item with key ${key}`, error);
            }
        }
    }
    return resultArr; // 返回结果数组  
};

export { setLocalStorageItems, getLocalStorageItemsByPrefix ,removeLocalStorageItemsByPrefix}



