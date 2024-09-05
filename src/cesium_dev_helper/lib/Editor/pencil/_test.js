
// 1.——————————————————————————————————————————————————————————————————————————————————————————
// createDynamicEntity(type, { extraOption, graphicOption, datasource }, getNewPosition) {
//     if (typeof getNewPosition !== 'function') throw new Error('cannot get new position')
//     const _type = type.toLowerCase();
//     const curPosArr = () => {//将坐标 转为 笛卡尔坐标（-已经没有必要-）
//         let curPosArr;
//         let _newPositions = getNewPosition();
//         isValidCartographic(_newPositions) ?
//             curPosArr = CoordTransformer.transformCartographicToCartesian3(_newPositions)
//             : curPosArr = _newPositions
//         return curPosArr
//     }

//     let entityOpt = {};
//     entityOpt[_type] = entityMaker.createGraphicsByType(_type, graphicOption);
//     entityOpt.polyline.positions = entityMaker.czm_callbackProperty(curPosArr()) //bug ？？？📌 ：curPosArr()换getNewPosition()修复完成
//     const finalOpt = {
//         ...extraOption,
//         ...entityOpt,// 已经绑定graphics 并且将坐标数据设置为动态
//     }
//     return datasource.entities.add(finalOpt)//dynamic entity
// }
