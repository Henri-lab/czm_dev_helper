/**
     * 创建corridor实体
     * @function
     * @param {object} options
     * @param {Cartesian3} options.positions - 坐标数组
     * @param {number} options.height - 高度
     * @param {number} options.width - 宽度
     * @param {object} options.material - 材质
     * @param {boolean} options.outline - 是否显示外边线
     * @param {number} options.extrudedHeight - 拉伸高度
     * @param {string} options.cornerType - 转角类型
     * @returns {corridor} 返回corridor实例
     */
export function CorridorEntity(options) {
  if (options && options.positions) {
    let entity = this.createGraphics();

    const properties = [
      { key: 'height', defaultValue: 10 },
      { key: 'width', defaultValue: 10 },
      { key: 'extrudedHeight', defaultValue: 10 },
      { key: 'cornerType', defaultValue: 'round' },
      {
        key: 'material', defaultValue: new Cesium.Scene.WarnLinkMaterialProperty({
          freely: 'cross',
          color: Cesium.Color.YELLOW,
          duration: 1000,
          count: 1.0,
          direction: '+'
        })
      }
    ];
    this._setProperties(options, properties);


    entity.corridor = this.CorridorGraphics(options);

    return this._graphicsLayer.entities.add(entity)
  }
}
