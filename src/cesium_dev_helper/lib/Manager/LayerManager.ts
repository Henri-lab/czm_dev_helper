import Manager from './Manager';
import * as Cesium from 'cesium';
import { I_LayerManagerClass } from '../../type/Manager';

// let Cesium = new Manager().Cesium;
//管理imageryLayers,datasource
class LayerManager extends Manager implements I_LayerManagerClass {
  constructor(viewer: Cesium.Viewer) {
    super(viewer);
    this.layers = [];
    this.customCache = [];
    // viewer.dataSources.dataSourceAdded.addEventListener((datasource) => console.log(datasource, 'dataSourceAdded'))
  }

  layers: Cesium.ImageryLayer[];
  customCache: Cesium.CustomDataSource[];
  addLayer(layer: Cesium.ImageryLayer) {
    console.log(layer, 'added Layer');
    this.layers.push(layer);
    this.viewer.imageryLayers.addImageryProvider(layer);
  }
  removeLayer(layer: Cesium.ImageryLayer) {
    const index = this.layers.indexOf(layer);
    if (index !== -1) {
      this.layers.splice(index, 1);
      this.viewer.imageryLayers.remove(layer);
    }
  }
  showLayer(layer: Cesium.ImageryLayer) {
    const index = this.viewer.imageryLayers.indexOf(layer);
    if (index !== -1) {
      this.viewer.imageryLayers.get(index).show = true;
    }
  }
  hideLayer(layer: Cesium.ImageryLayer) {
    const index = this.viewer.imageryLayers.indexOf(layer);
    if (index !== -1) {
      this.viewer.imageryLayers.get(index).show = false;
    }
  }

  //是否有必要保证图源的唯一性？🙄

  // Cesium 中的 DataSource 提供了一种管理和组织实体的方式，使得对实体的批量操作和管理更加方便。
  // 通常使用 CustomDataSource 来创建自定义的数据源，然后将实体添加到这个数据源中。
  getOrCreateDatasourceByName(name: string): Cesium.CustomDataSource {
    //获得指定图源或者创建一个图源 缓存
    if (typeof name !== 'string') return null;
    const _viewer = this.viewer;
    // find
    let dataSource = _viewer.dataSources.getByName(name)[0];
    if (!dataSource) {
      dataSource = new Cesium.CustomDataSource(name);
      console.log(dataSource, 'create new datasource');
      this.customCache.push(dataSource);
    }
    return dataSource;
  }
  getDatasourceByName(name: string): string {
    if (typeof name !== 'string') return null;
    const _viewer = this.viewer;
    // find
    let res = _viewer.dataSources.getByName(name)[0]; //bug🚨
    return res;
  }
  // 没有图源就创建图源 并添加到viewer
  // 有图源直接添加到viewer
  addDatasourceByName(name: string): Cesium.CustomDataSource {
    if (typeof name !== 'string') return null;
    let _viewer = this.viewer;
    const uniqueDatasource = this.getOrCreateDatasourceByName(name);
    _viewer.dataSources.add(uniqueDatasource);
    // _viewer.zoomTo(ds)
    return uniqueDatasource; //unique
  }
  getOwnerOfEntity: (entity: Cesium.Entity) => Cesium.ImageryLayer;
  static getOwnerOfEntity(
    entity: Cesium.Entity
  ): Cesium.DataSource | Cesium.CompositeEntityCollection {
    return entity.entityCollection.owner;
  }
}

export default LayerManager;

// Cesium.DataSourceCollection 是 Cesium 中用于管理多个数据源的集合。
// 每个数据源通常代表一组地理数据，可以是实体、影像图层等。
// 以下是 Cesium.DataSourceCollection 对象及其属性和方法的说明：

// 主要属性
// length
// 类型: Number
// 说明: 当前集合中数据源的数量。

// 主要方法
// add(dataSource, index)
// 参数:
// dataSource (必选): 需要添加的数据源对象。
// index (可选): 在集合中的位置索引。如果未提供，数据源将添加到集合末尾。
// 返回值: 被添加的数据源对象。
// 说明: 将数据源添加到集合中。
// remove(dataSource, destroy)
// 参数:
// dataSource (必选): 需要移除的数据源对象。
// destroy (可选): 布尔值，是否在移除时销毁该数据源，默认值为 false。
// 返回值: 如果成功移除则返回 true，否则返回 false。
// 说明: 从集合中移除指定的数据源。
// removeAll(destroy)
// 参数:
// destroy (可选): 布尔值，是否在移除时销毁所有数据源，默认值为 false。
// 说明: 从集合中移除所有数据源。
// get(index)
// 参数:
// index (必选): 需要获取的数据源在集合中的索引。
// 返回值: 返回指定索引处的数据源对象。
// 说明: 获取集合中指定索引的数据源。
// contains(dataSource)
// 参数:
// dataSource (必选): 需要检查的数据源对象。
// 返回值: 如果集合中包含该数据源则返回 true，否则返回 false。
// 说明: 检查集合中是否包含指定的数据源。
// raiseToTop(dataSource)
// 参数:
// dataSource (必选): 需要提升的数据源对象。
// 说明: 将指定的数据源提升到集合顶部。
// lowerToBottom(dataSource)
// 参数:
// dataSource (必选): 需要降低的数据源对象。
// 说明: 将指定的数据源降低到集合底部。

// 事件
// dataSourceAdded
// 说明: 当数据源添加到集合中时触发。
// dataSourceRemoved
// 说明: 当数据源从集合中移除时触发。
// dataSourceMoved
// 说明: 当数据源在集合中移动位置时触发。
