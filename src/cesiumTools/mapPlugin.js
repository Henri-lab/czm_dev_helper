/*
 * @Description:
 * @Author: your name
 * @version:
 * @Date: 2024-02-06 15:28:13
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 14:06:34
 */
import * as Cesium from "cesium";

/**
 * 底图拓展来源 github:cesium-map
 */
const BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const RADIUS = 6378245.0;
const EE = 0.00669342162296594323;
/**
 * 定义坐标转换工具
 */
class CoordTransform {
  /**
   * BD-09 To GCJ-02
   * @param lng
   * @param lat
   * @returns {number[]}
   */
  static BD09ToGCJ02(lng, lat) {
    let x = +lng - 0.0065;
    let y = +lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * BD_FACTOR);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * BD_FACTOR);
    let gg_lng = z * Math.cos(theta);
    let gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
  }

  /**
   * GCJ-02 To BD-09
   * @param lng
   * @param lat
   * @returns {number[]}
   * @constructor
   */
  static GCJ02ToBD09(lng, lat) {
    lat = +lat;
    lng = +lng;
    let z =
      Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * BD_FACTOR);
    let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * BD_FACTOR);
    let bd_lng = z * Math.cos(theta) + 0.0065;
    let bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
  }

  /**
   * WGS-84 To GCJ-02
   * @param lng
   * @param lat
   * @returns {number[]}
   */
  static WGS84ToGCJ02(lng, lat) {
    lat = +lat;
    lng = +lng;
    if (this.out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      let d = this.delta(lng, lat);
      return [lng + d[0], lat + d[1]];
    }
  }

  /**
   * GCJ-02 To WGS-84
   * @param lng
   * @param lat
   * @returns {number[]}
   * @constructor
   */
  static GCJ02ToWGS84(lng, lat) {
    lat = +lat;
    lng = +lng;
    if (this.out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      let d = this.delta(lng, lat);
      let mgLng = lng + d[0];
      let mgLat = lat + d[1];
      return [lng * 2 - mgLng, lat * 2 - mgLat];
    }
  }

  /**
   *
   * @param lng
   * @param lat
   * @returns {number[]}
   */
  static delta(lng, lat) {
    let dLng = this.transformLng(lng - 105, lat - 35);
    let dLat = this.transformLat(lng - 105, lat - 35);
    const radLat = (lat / 180) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLng = (dLng * 180) / ((RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
    dLat = (dLat * 180) / (((RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI);
    return [dLng, dLat];
  }

  /**
   *
   * @param lng
   * @param lat
   * @returns {number}
   */
  static transformLng(lng, lat) {
    lat = +lat;
    lng = +lng;
    let ret =
      300.0 +
      lng +
      2.0 * lat +
      0.1 * lng * lng +
      0.1 * lng * lat +
      0.1 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((lng / 12.0) * PI) +
        300.0 * Math.sin((lng / 30.0) * PI)) *
        2.0) /
      3.0;
    return ret;
  }

  /**
   *
   * @param lng
   * @param lat
   * @returns {number}
   */
  static transformLat(lng, lat) {
    lat = +lat;
    lng = +lng;
    let ret =
      -100.0 +
      2.0 * lng +
      3.0 * lat +
      0.2 * lat * lat +
      0.1 * lng * lat +
      0.2 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((lat / 12.0) * PI) +
        320 * Math.sin((lat * PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  }

  /**
   *
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  static out_of_china(lng, lat) {
    lat = +lat;
    lng = +lng;
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
  }
}

/**
 * 定义火星投影 高德和腾讯地图坐标系
 */
class GCJMercatorTilingScheme extends Cesium.WebMercatorTilingScheme {
  constructor(options) {
    super(options);
    let projection = new Cesium.WebMercatorProjection();
    this._projection.project = function (cartographic, result) {
      result = CoordTransform.WGS84ToGCJ02(
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
      result = CoordTransform.GCJ02ToWGS84(
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
    if(options.crs==='GCJ02'){
      options['tilingScheme'] = new GCJMercatorTilingScheme()
    }
    super(options)
  }
}


export {
  TencentImageryProvider,
  GoogleImageryProvider
};
