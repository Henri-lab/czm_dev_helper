import axios from 'axios'

const gaode = axios.create({
    baseURL: 'https://restapi.amap.com/v3', // 设置基本URL
    timeout: 5000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json' // 设置默认请求头  --返回json数据
    }
})
const aliyun = axios.create({
    baseURL: 'https://geo.datav.aliyun.com/areas_v3', // 设置基本URL
    timeout: 5000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json' // 设置默认请求头  --返回json数据
    }
})

export { aliyun ,gaode}