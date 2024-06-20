/*
 * @Description:
 * @Author: your name
 * @version:
 * @Date: 2024-05-08 14:31:24
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 14:41:34
 */
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 所有请求的公共地址部分
  headers: { "Content-Type": "application/json;charset=UTF-8" },
  withCredentials: true, // 跨域请求时是否需要使用凭证
  timeout: 30000, // 请求超时时间
});

api.interceptors.request.use(
  (config) => {
    // config 请求的所有信息
    return config; // 将配置完成的config对象返回出去 如果不返回 请求讲不会进行
  },
  (err) => {
    // 请求发生错误时的相关处理 抛出错误
    Promise.reject(err);
  }
);

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data.code === 200) {
      return data;
    } else {
      return Promise.reject(data);
    }
  },
  (err) => {
    return Promise.reject(err.response);
  }
);


export default api;
