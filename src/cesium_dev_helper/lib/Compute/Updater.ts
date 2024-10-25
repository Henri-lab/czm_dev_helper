import * as Cesium from 'cesium';
import { EntityOption } from '../../type';
export default class Updater {
  static updateEntityPosByType(
    type: string,
    pickedPosCollection: Cesium.Cartesian3[] = [],
    newPickPos: Cesium.Cartesian3,
    entityOptions: EntityOption = {},
    isClose: boolean = true
  ): void {
    // 多边形闭合处理
    if (isClose) {
      if (type !== 'point' && type !== 'polyline') {
        // 处理多边形闭合：将第一个点追加到数组末尾
        if (pickedPosCollection.length > 1) {
          pickedPosCollection.push(pickedPosCollection[0]);
        }
        entityOptions.positions = pickedPosCollection;
      }
      // 仅用于闭合图形更新，提前返回
      return;
    }

    // ---根据实体类型更新位置---

    // 处理折线（polyline）类型：更新末端点坐标
    if (type === 'polyline' && pickedPosCollection.length >= 2) {
      pickedPosCollection.pop();
      pickedPosCollection.push(newPickPos);
    }
    // 处理矩形（rectangle）类型：保持两个端点坐标
    else if (type === 'rectangle') {
      if (pickedPosCollection.length === 1) {
        pickedPosCollection.push(newPickPos);
      } else {
        pickedPosCollection[1] = newPickPos;
      }
    }
    // 处理椭圆（ellipse）类型：计算并更新半径
    else if (type === 'ellipse') {
      if (pickedPosCollection.length === 0) return; // 没有圆心则返回
      if (pickedPosCollection.length === 1) {
        const center = pickedPosCollection[0];
        const radius = Cesium.Cartesian3.distance(center, newPickPos);
        // 动态更新半径，每帧调用
        const dynamicRadius = new Cesium.CallbackProperty(() => radius, false);
        entityOptions.semiMajorAxis = dynamicRadius;
        entityOptions.semiMinorAxis = dynamicRadius;
      }
    }
    // 对于其他类型的实体，将新位置直接添加到坐标集合中
    else {
      pickedPosCollection.push(newPickPos);
    }

    // 更新实体的配置选项点坐标
    entityOptions.positions = pickedPosCollection;
  }
}
