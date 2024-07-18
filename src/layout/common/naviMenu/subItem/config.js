import { MENU_ITEM_KEY_Map as KEY, MENU_ITEM_TITLE_CN_Map as CN } from "./enums";
let index = 0;

const pencilMenuItems = [
    { id: `${index++}`, key: KEY[1]/*'pencil_test' */, label: CN[KEY[1]]/*'画笔测试' */ },
];
const materialMenuItems = [
    { id: `${index++}`, key: KEY[2], label: CN[KEY[2]] },
];
const sceneMenuItems = [
    { id: `${index++}`, key: KEY[3], label: CN[KEY[3]] },
];
const sourceMenuItems = [
    { id: `${index++}`, key: KEY[4], label: CN[KEY[4]] },
    { id: `${index++}`, key: KEY[41], label: CN[KEY[41]]/*'3D Tiles' */ },
    { id: `${index++}`, key: KEY[42], label: CN[KEY[42]] /*'glTF */ },
];
const toolMenuItems = [
    { id: `${index++}`, key: KEY[5], label: CN[KEY[5]] },
];
const threeMenuItems = [
    { id: `${index++}`, key: KEY[6], label: CN[KEY[6]] },
];
const userMenuItems = [
    { id: `${index++}`, key: KEY[7], label: CN[KEY[7]] },
];
export {
    pencilMenuItems,
    materialMenuItems,
    sceneMenuItems,
    sourceMenuItems,
    toolMenuItems,
    threeMenuItems,
    userMenuItems,
}