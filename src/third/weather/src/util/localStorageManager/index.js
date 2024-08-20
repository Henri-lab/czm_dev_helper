import { setLocalStorageItems, getLocalStorageItemsByPrefix } from './getAndSet'
// 利用predix来标识item的对象类别
export default function localStorageManager(type, predix, arr) {
    switch (type) {
        case 'set/timestamp':
            // arr为数据源
            // 注意时间戳在某些场景下会出现非唯一性风险
            setLocalStorageItems(predix, arr, 'timestamp');
            break;
        case 'set/count':
            setLocalStorageItems(predix, arr, 'count');
            break;
        case 'set/random':
            setLocalStorageItems(predix, arr, 'random');
            break;
        case 'set/uuid':
            setLocalStorageItems(predix, arr, 'uuid');
            break;
        case 'get':
            arr = getLocalStorageItemsByPrefix(predix, arr);
            // arr为结果集
            return arr;
        default:
            // 处理未知的type
            console.log('localStorageManager参数异常')
            return null;
    }
}


// 示例：
// 将students[100]存入localStorage；
// localStorage('set/timestamp','student-',students[100])

// 将students从localStorage中提取出来，并用result[?]来存储；
// localStorage('get','student-',result[?])

