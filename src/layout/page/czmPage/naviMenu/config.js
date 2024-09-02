// 树状菜单结构初始化
export const menuStructure = {};
// 编码表💫
const MENU_LABEL = {
    pencil: 'Pencil',
    material: 'Material',
    scene: 'Scene',
    source: 'Source',
    tool: 'Tool',
    three: 'Three',
    user: 'User',
};
const MENU_ITEM_LABEL = { // 汉化
    'pencil:test': '画笔测试',
    'material:test': '材质测试',
    'scene:test': '后处理测试',
    'source:mono': '城市白膜加载',
    'source:3dtiles': '3DTiles加载',
    'source:gltf': 'glTF加载',
    'tool:test': '工具测试',
    'three:test': 'THREE测试',
    'user:test': '用户测试',
};

// 示例
// const menuStructure = {
//     'pencil': {
//         key: 'a',
//         label: MENU_LABEL.pencil,
//         items: [
//             { key: 'a-1', label: MENU_ITEM_LABEL[`pencil:test`] }
//         ]
//     },
//     'material': {
//         key: 'b',
//         label: MENU_LABEL.material,
//         items: [
//             { key: 'b-1', label: MENU_ITEM_LABEL[`material:test`] }
//         ]
//     },
//     'scene': {
//         key: 'c',
//         label: MENU_LABEL.scene,
//         items: [
//             { key: 'c-1', label: MENU_ITEM_LABEL[`scene:test`] }
//         ]
//     },
//     'source': {
//         key: 'd',
//         label: MENU_LABEL.source,
//         items: [
//             { key: 'd-1', label: MENU_ITEM_LABEL[`source:mono`] },
//             { key: 'd-2', label: MENU_ITEM_LABEL[`source:3dtiles`] },
//             { key: 'd-3', label: MENU_ITEM_LABEL[`source:gltf`] }
//         ]
//     },
//     'tool': {
//         key: 'e',
//         label: MENU_LABEL.tool,
//         items: [
//             { key: 'e-1', label: MENU_ITEM_LABEL[`tool:test`] }
//         ]
//     },
//     'three': {
//         key: 'f',
//         label: MENU_LABEL.three,
//         items: [
//             { key: 'f-1', label: MENU_ITEM_LABEL[`three:test`] }
//         ]
//     },
//     'user': {
//         key: 'g',
//         label: MENU_LABEL.user,
//         items: [
//             { key: 'g-1', label: MENU_ITEM_LABEL[`user:test`] }
//         ]
//     }
// };



const config = {
    pencil: ['test'],
    material: ['test'],
    scene: ['test'],
    source: ['mono', '3dtiles', 'gltf'],
    tool: ['test'],
    three: ['test'],
    user: ['test']
}
// 自动生成菜单结构
Object.keys(config).forEach((prop, index) => {
    // 生成 key 的前缀（从 a 开始）
    const keyPrefix = String.fromCharCode(97 + index); // 97 是字符 'a' 的 ASCII 码
    const items = config[prop].map((subItem, subIndex) => ({
        key: `${keyPrefix}-${subIndex + 1}`, // 生成子项的 key a1、a2...
        label: MENU_ITEM_LABEL[`${prop}:${subItem}`]// 使用对应的 label
    }));

    // 填充 menuStructure
    menuStructure[prop] = {
        key: keyPrefix,
        label: MENU_LABEL[prop],
        items: items
    };
});

console.log(menuStructure,'menuStructure')
export const menuOption = () => {
    const res = []
    Object.keys(menuStructure).forEach(prop => {
        res.push({
            type: prop,
            key: menuStructure[prop].key,
            label: menuStructure[prop].label
        }
        )
    })
    return res
}

export const getItemsByCode = (value) => {
    Object.keys(menuStructure).find(prop => {
        if (menuStructure[prop][key] == value) {
            return menuStructure[prop].items
        }
    })
}

export const getItemsByType = (value) => {
    Object.keys(menuStructure).find(prop => {
        if (menuStructure[prop]['type'] == value) {
            return menuStructure[prop].items
        }
    })
}