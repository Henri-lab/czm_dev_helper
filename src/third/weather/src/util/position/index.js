import { fetchCoordinatesH5 } from "./fetchCoordinatesH5"

export default async function getPosition(method) {
    //返回HTML5的定位数据position
    // position.jingH5 经度
    // position.weiH5  纬度
    if (method === 'H5') return await fetchCoordinatesH5()
}