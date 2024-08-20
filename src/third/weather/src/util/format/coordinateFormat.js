// 定义源投影和目标投影
let sourceProj = 'EPSG:3857';
let destProj = 'EPSG:4326';

// 使用 Proj4js 转换坐标
export default function coordinatesFormat(jing, wei) {
    let coord = [jing, wei];
    let converted = proj4(sourceProj, destProj, coord);

    // 格式化输出
    let latitude = converted[1];
    let longitude = converted[0];
    let latDir = latitude >= 0 ? '北纬' : '南纬';
    let lonDir = longitude >= 0 ? '东经' : '西经';

    let formattedLat = `${latDir} ${Math.abs(latitude).toFixed(2)}°`;
    let formattedLon = `${lonDir} ${Math.abs(longitude).toFixed(2)}°`;
    return (`${formattedLat}, ${formattedLon}`);
}
