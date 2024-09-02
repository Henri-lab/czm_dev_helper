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
//         code: 'a',
//         label: MENU_LABEL.pencil,
//         items: [
//             { code: 'a-1', label: MENU_ITEM_LABEL[`pencil:test`] }
//         ]
//     },
//     'material': {
//         code: 'b',
//         label: MENU_LABEL.material,
//         items: [
//             { code: 'b-1', label: MENU_ITEM_LABEL[`material:test`] }
//         ]
//     },
//     'scene': {
//         code: 'c',
//         label: MENU_LABEL.scene,
//         items: [
//             { code: 'c-1', label: MENU_ITEM_LABEL[`scene:test`] }
//         ]
//     },
//     'source': {
//         code: 'd',
//         label: MENU_LABEL.source,
//         items: [
//             { code: 'd-1', label: MENU_ITEM_LABEL[`source:mono`] },
//             { code: 'd-2', label: MENU_ITEM_LABEL[`source:3dtiles`] },
//             { code: 'd-3', label: MENU_ITEM_LABEL[`source:gltf`] }
//         ]
//     },
//     'tool': {
//         code: 'e',
//         label: MENU_LABEL.tool,
//         items: [
//             { code: 'e-1', label: MENU_ITEM_LABEL[`tool:test`] }
//         ]
//     },
//     'three': {
//         code: 'f',
//         label: MENU_LABEL.three,
//         items: [
//             { code: 'f-1', label: MENU_ITEM_LABEL[`three:test`] }
//         ]
//     },
//     'user': {
//         code: 'g',
//         label: MENU_LABEL.user,
//         items: [
//             { code: 'g-1', label: MENU_ITEM_LABEL[`user:test`] }
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
    // 生成 code 的前缀（从 a 开始）
    const codePrefix = String.fromCharCode(97 + index); // 97 是字符 'a' 的 ASCII 码
    const items = config[prop].map((subItem, subIndex) => ({
        code: `${codePrefix}-${subIndex + 1}`, // 生成子项的 code a1、a2...
        label: MENU_ITEM_LABEL[`${MENU_LABEL[prop]}:${subItem}`] // 使用对应的 label
    }));

    // 填充 menuStructure
    menuStructure[prop] = {
        code: codePrefix,
        label: MENU_LABEL[prop],
        items: items
    };
});


export const menuOption = () => {
    const res = []
    Object.keys(menuStructure).forEach(prop => {
        res.push({
            type: prop,
            code: menuStructure[prop].code,
            label: menuStructure[prop].label
        }
        )
    })
    return res
}

export const getItemsByCode = (value) => {
    Object.keys(menuStructure).find(prop => {
        if (menuStructure[prop][code] == value) {
            return menuStructure[prop].items
        }
    })
}

export const getItemsByType = (value) => {
    Object.keys(menuStructure).find(prop => {
        if (menuStructure[prop][type] == value) {
            return menuStructure[prop].items
        }
    })
}