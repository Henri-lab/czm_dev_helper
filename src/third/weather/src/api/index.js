
import axios from 'axios'
import { gaode } from './Instance'
import { aliyun } from './Instance'
const key = import.meta.env.VITE_GAODE_KEY

// 地理编码
const getLocal = async () => {
    try {
        const res = await gaode.get(`/ip?key=${key}`)
        return res.data
    } catch (error) {
        console.error('Error request data:', error)
        return 0
    }
}

const geoByAddress = async (address) => {
    try {
        const res = await gaode.get(`/geocode/geo?key=${key}&address=${address}`)
        return res
    } catch (error) {
        console.error('Error request data:', error)
        return 0
    }
}

//逆地理编码------------------------------------------------
const regeoByCoordinates = async (lon, lat, prop) => {
    try {
        const res = await gaode.get(`/geocode/regeo?location=${lon},${lat}&key=${key}`);
        if (res.data.status === '1' && res.data.regeocode.addressComponent) {
            switch (prop) {
                case 'city':
                    if (res.data.regeocode.addressComponent.city != []) {
                        console.log('city success:', res.data.regeocode.addressComponent)
                        return res.data.regeocode.addressComponent.city;
                    }
                    break;
                case 'adcode':
                    if (res.data.regeocode.addressComponent.adcode != [])
                        return res.data.regeocode.addressComponent.adcode;
                    break;
                case 'province':
                    if (res.data.regeocode.addressComponent.province != [])
                        console.log('province success:', res.data.regeocode.addressComponent)
                    return res.data.regeocode.addressComponent.province;
                    break;
                case 'district':
                    if (res.data.regeocode.addressComponent.district != [])
                        return res.data.regeocode.addressComponent.district;
                    break;
                case 'township':
                    if (res.data.regeocode.addressComponent.township != [])
                        return res.data.regeocode.addressComponent.township;
                    break;
                case 'citycode':
                    if (res.data.regeocode.addressComponent.citycode != [])
                        return res.data.regeocode.addressComponent.citycode;
                    break;
                case 'country':
                    if (res.data.regeocode.addressComponent.country != [])
                        return res.data.regeocode.addressComponent.country;
                    break;
                case "streetNumber":
                    if (res.data.regeocode.addressComponent.streetNumber != [])
                        return res.data.regeocode.addressComponent.streetNumber;
                    break;
                case "towncode":
                    if (res.data.regeocode.addressComponent.towncode != [])
                        return res.data.regeocode.addressComponent.towncode;
                    break;
                case 'building':
                    if (res.data.regeocode.addressComponent.building != [])
                        return res.data.regeocode.addressComponent.building;
                    break;
                case 'neighborhood':
                    if (res.data.regeocode.addressComponent.neighborhood != [])
                        return res.data.regeocode.addressComponent.neighborhood;
                    break;
                case 'businessAreas':
                    if (res.data.regeocode.addressComponent.businessAreas != [])
                        return res.data.regeocode.addressComponent.businessAreas;
                    break;
                case 'formattedAddress':
                    if (res.data.regeocode.formatted_Address != [])
                        return res.data.regeocode.formatted_Address;
                    break;
                default:
                    console.log(`你正在解构API返回结果中不存在的数据${prop}`)
                    break;
            }
            return 0;
        }
        else throw new Error(`高德-逆地理-失败`);
    } catch (error) {
        console.error('请求高德地图API失败:', error);
    }
}

// 天气查询------------------------------------------------
const getWeatherPrediction = async (adcode) => {
    try {
        const res = await gaode.get(`/weather/weatherInfo?key=${key}&city=${adcode}&extensions=all`)
        return res
    } catch (error) {
        console.error('Error request data:', error)
        return 0
    }
}

const getWeatherLive = async (adcode) => {
    try {
        const res = await gaode.get(`/weather/weatherInfo?key=${key}&city=${adcode}&extensions=base`)
        return res
    } catch (error) {
        console.error('Error request data:', error)
        return 0
    }
}


// aliyun
const getFeaturesByAdcodeByAliyun = async (adcode) => {
    try {
        const res = await aliyun.get(`/bound/${adcode}_full.json`)
        return new ol.format.GeoJSON().readFeatures(res)
    } catch (error) {
        console.error(' getFeaturesByAliyun:', error)
        return 0
    }
}

// http://39.103.151.139:8000/ 非官方接口
const getCityHttp = async () => {
    return await axios({
        url: "/cheng/city"
    })
}

















export { getLocal, geoByAddress, getWeatherPrediction, getWeatherLive, regeoByCoordinates, getFeaturesByAdcodeByAliyun, getCityHttp }

