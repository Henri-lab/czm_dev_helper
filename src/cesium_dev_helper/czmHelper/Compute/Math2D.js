/**
 * Math2D计算模块
 */
export default class Math2d {
    /**
     * @param {Viewer} viewer - Cesium viewer 实例
     * @param {Object} cesiumGlobal - Cesium 全局对象
     */
    constructor(viewer) {
        this._viewer = viewer;
    }

    /**
     * 计算两个坐标之间的距离
     * @param {Array} pnt1 - 坐标点1
     * @param {Array} pnt2 - 坐标点2
     * @returns {number} 计算后距离
     */
    mathDistance2d(pnt1, pnt2) {
        return Math.sqrt(Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2));
    }

    /**
     * 求圆周上等分点的坐标
     * @param {number} r - 半径
     * @param {number} ox - 圆心坐标y轴
     * @param {number} oy - 圆心坐标x轴
     * @param {number} count - 等分个数
     * @returns {Array} 等分后的坐标数组
     */
    getCirclePoints2d(r, ox, oy, count) {
        const point = [];
        const radians = (Math.PI / 180) * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
            const x = ox + r * Math.sin(radians * i);
            const y = oy + r * Math.cos(radians * i);
            point.unshift({ x, y });
        }
        return point;
    }

    /**
     * 计算点集合的总距离
     * @param {Array} points - 多个点的数组
     * @returns {number} 距离
     */
    wholeDistance2d(points) {
        let distance = 0;
        for (let i = 0; i < points.length - 1; i++) {
            distance += this.mathDistance2d(points[i], points[i + 1]);
        }
        return distance;
    }

    /**
     * 获取基础长度
     * @param {Array} points - 多个点的数组
     * @returns {number} 长度
     */
    getBaseLength2d(points) {
        return Math.pow(this.wholeDistance2d(points), 0.99);
    }

    /**
      * 获取两个点之间的中点
      * @param {Array} pnt1 - 坐标点1
      * @param {Array} pnt2 - 坐标点2
      * @returns {Array} 中点坐标
      */
    getMidpoint2d(pnt1, pnt2) {
        return [(pnt1[0] + pnt2[0]) / 2, (pnt1[1] + pnt2[1]) / 2];
    }

    /**
     * 获取两点之间的斜率
     * @param {Array} pnt1 - 坐标点1
     * @param {Array} pnt2 - 坐标点2
     * @returns {number} 斜率值
     */
    getSlope2d(pnt1, pnt2) {
        return (pnt2[1] - pnt1[1]) / (pnt2[0] - pnt1[0]);
    }

    /**
       * 检查点是否在线段上
       * @param {Array} pnt - 待检查点
       * @param {Array} startPnt - 线段起点
       * @param {Array} endPnt - 线段终点
       * @returns {boolean} 是否在线段上
       */
    isPointOnSegment2d(pnt, startPnt, endPnt) {
        if ((pnt[0] - startPnt[0]) * (pnt[0] - endPnt[0]) > 0 || (pnt[1] - startPnt[1]) * (pnt[1] - endPnt[1]) > 0) {
            return false;
        }
        return true;
    }

    /**
      * 计算两个矩形的交集
      * @param {Array} rect1 - 矩形1的坐标数组 [x1, y1, x2, y2]
      * @param {Array} rect2 - 矩形2的坐标数组 [x1, y1, x2, y2]
      * @returns {Array|null} 交集矩形的坐标数组 [x1, y1, x2, y2]，如果无交集则返回null
      */
    getRectIntersect2d(rect1, rect2) {
        const x1 = Math.max(rect1[0], rect2[0]);
        const y1 = Math.max(rect1[1], rect2[1]);
        const x2 = Math.min(rect1[2], rect2[2]);
        const y2 = Math.min(rect1[3], rect2[3]);
        if (x1 < x2 && y1 < y2) {
            return [x1, y1, x2, y2];
        }
        return null;
    }

    /**
      * 通过三个点计算方位角
      * @param {Array} pntA - 坐标点A
      * @param {Array} pntB - 坐标点B
      * @param {Array} pntC - 坐标点C
      * @returns {number} 方位角
      */
    getAngleFromThreePoints(pntA, pntB, pntC) {
        const AB = [pntB[0] - pntA[0], pntB[1] - pntA[1]];
        const BC = [pntC[0] - pntB[0], pntC[1] - pntB[1]];
        const dotProduct = AB[0] * BC[0] + AB[1] * BC[1];
        const magnitudeAB = Math.sqrt(AB[0] * AB[0] + AB[1] * AB[1]);
        const magnitudeBC = Math.sqrt(BC[0] * BC[0] + BC[1] * BC[1]);
        const cosTheta = dotProduct / (magnitudeAB * magnitudeBC);
        return Math.acos(cosTheta) * (180 / Math.PI);
    }

    /**
     * 通过三个点确定一个圆的中心点
     * @param {Array} pntA - 坐标点A
     * @param {Array} pntB - 坐标点B
     * @param {Array} pntC - 坐标点C
     * @returns {Array} 圆心坐标 [x, y]
     */
    getCircleCenterFromThreePoints(pntA, pntB, pntC) {
        const D = 2 * (pntA[0] * (pntB[1] - pntC[1]) + pntB[0] * (pntC[1] - pntA[1]) + pntC[0] * (pntA[1] - pntB[1]));
        const Ux = ((pntA[0] * pntA[0] + pntA[1] * pntA[1]) * (pntB[1] - pntC[1]) +
            (pntB[0] * pntB[0] + pntB[1] * pntB[1]) * (pntC[1] - pntA[1]) +
            (pntC[0] * pntC[0] + pntC[1] * pntC[1]) * (pntA[1] - pntB[1])) / D;
        const Uy = ((pntA[0] * pntA[0] + pntA[1] * pntA[1]) * (pntC[0] - pntB[0]) +
            (pntB[0] * pntB[0] + pntB[1] * pntB[1]) * (pntA[0] - pntC[0]) +
            (pntC[0] * pntC[0] + pntC[1] * pntC[1]) * (pntB[0] - pntA[0])) / D;
        return [Ux, Uy];
    }

    /**
    * 通过两个矢量获取方位角
    * @param {Object} vector1 - 第一个矢量，包含x和y属性
    * @param {Object} vector2 - 第二个矢量，包含x和y属性
    * @returns {number} 方位角（以度为单位）
    */
    getAzimuth(vector1, vector2) {
        const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
        const magnitude1 = Math.sqrt(vector1.x * vector1.y + vector1.y * vector1.y);
        const magnitude2 = Math.sqrt(vector2.x * vector2.y + vector2.y * vector2.y);
        const cosineTheta = dotProduct / (magnitude1 * magnitude2);
        let angle = Math.acos(cosineTheta) * (180 / Math.PI);
        return angle;
    }

    /**
   * 判断是否是顺时针
   * @function
   * @param {Array} pnt1 - 起始点
   * @param {Array} pnt2 - 坐标c1
   * @param  {Array} pnt3 - 坐标c2
   * @returns {boolean}  是否是顺时针
   */
    isClockWiseCoord2d(pnt1, pnt2, pnt3) {
        return (pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0]);
    }

    /**
     * 判断两个矢量是否是顺时针方向
     * @param {Object} vector1 - 第一个矢量，包含x和y属性
     * @param {Object} vector2 - 第二个矢量，包含x和y属性
     * @returns {boolean} 是否是顺时针方向
     */
    isClockwiseVector2d(vector1, vector2) {
        return vector1.x * vector2.y - vector1.y * vector2.x < 0;
    }

}
