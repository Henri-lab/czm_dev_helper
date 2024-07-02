//纠正底图 https://www.yuque.com/xzd/xzbt0l/qo69dsyvz1h2frzx  pw:xkpf

import * as Cesium from "cesium";
import { CoordTransformer } from '../Compute'

/**
 * 坐标转换器
 */
const cT = new CoordTransformer();
// cT.BD09ToGCJ02()
/**
 * 底图拓展来源 github:cesium-map
 */

/**
 * 定义火星投影 高德和腾讯地图坐标系
 */
class GCJMercatorTilingScheme extends Cesium.WebMercatorTilingScheme {
  constructor(options) {
    super(options);
    let projection = new Cesium.WebMercatorProjection();
    this._projection.project = function (cartographic, result) {
      result = cT.WGS84ToGCJ02(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude)
      );
      result = projection.project(
        new Cesium.Cartographic(
          Cesium.Math.toRadians(result[0]),
          Cesium.Math.toRadians(result[1])
        )
      );
      return new Cesium.Cartesian2(result.x, result.y);
    };
    this._projection.unproject = function (cartesian, result) {
      let cartographic = projection.unproject(cartesian);
      result = cT.GCJ02ToWGS84(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude)
      );
      return new Cesium.Cartographic(
        Cesium.Math.toRadians(result[0]),
        Cesium.Math.toRadians(result[1])
      );
    };
  }
}

const IMG_URL =
  "https://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=400&&key=d84d6d83e0e51e481e50454ccbe8986b";

const ELEC_URL =
  "https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid={style}&scene=0&version=347&&key=d84d6d83e0e51e481e50454ccbe8986b";

class TencentImageryProvider extends Cesium.UrlTemplateImageryProvider {
  constructor(options = {}) {
    let url = options.style === "img" ? IMG_URL : ELEC_URL;
    options["url"] = url.replace("{style}", options.style || 1);
    if (!options.subdomains || !options.subdomains.length) {
      options["subdomains"] = ["0", "1", "2"];
    }
    if (options.style === "img") {
      options["customTags"] = {
        sx: (imageryProvider, x, y, level) => {
          return x >> 4;
        },
        sy: (imageryProvider, x, y, level) => {
          return ((1 << level) - y) >> 4;
        },
      };
    }
    // 修改源码，如果投影为WGS84C,采用火星坐标系投影
    options.crs = options.crs || "WGS84";
    if (options.crs === "WGS84") {
      options["tilingScheme"] = new GCJMercatorTilingScheme(options);
    }
    super(options);
  }
}

const TILE_URL = {
  img: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
  elec: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}',
  cva: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=h&x={x}&y={y}&z={z}',
  ter: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=t@131,r&x={x}&y={y}&z={z}',
  img_cva: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=y&x={x}&y={y}&z={z}',
}

class GoogleImageryProvider extends Cesium.UrlTemplateImageryProvider {
  constructor(options = {}) {
    options['url'] =
      options.url ||
      [
        options.protocol || '',
        TILE_URL[options.style] || TILE_URL['elec'],
      ].join('')
    // // 修改源码，如果投影为GCJ02,采用火星坐标系投影
    if (options.crs === 'GCJ02') {
      options['tilingScheme'] = new GCJMercatorTilingScheme()
    }
    super(options)
  }
}


export {
  GCJMercatorTilingScheme,
  TencentImageryProvider,
  GoogleImageryProvider
};
