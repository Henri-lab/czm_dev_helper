// 利用拦截器进行api请求--备用
import axios from 'axios';

// 配置axios实例
const api = axios.create({
    baseURL: 'https://restapi.amap.com/v3/geocode'
});

// 添加请求拦截器
api.interceptors.request.use(config => {
    // 在发送请求之前做些什么，例如添加API密钥
    config.params = config.params || {};
    config.params.key = '你的高德API密钥';  // 替换为你的API密钥
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
api.interceptors.response.use(response => {
    // 对响应数据做点什么
    if (response.data.status === '1' && response.data.regeocode) {
        return response.data.regeocode.addressComponent.city;
    } else {
        return Promise.reject('无法获取位置信息');
    }
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 函数：根据经纬度获取城市信息
export default async function getCityByXY(lat, lon) {
    try {
        const response = await api.get('/regeo', { params: { location: `${lon},${lat}` } });
        console.log('该坐标的城市是:', response);
        return response;
    } catch (error) {
        console.error('请求高德地图API失败:', error);
    }
}
