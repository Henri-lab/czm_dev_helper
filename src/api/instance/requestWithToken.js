import axios from "axios";
import { ElMessageBox, ElMessage } from "element-plus";
import Cookies from "js-cookie";

// 创建axios实例
const instance = axios.create({
  baseURL: "/dev-api", // 设置API的基础URL
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可在请求发送前对config进行修改，如添加请求头等
    const headers = config.headers || {};
    headers["Authorization"] = Cookies.get("Admin-Token");
    config.headers = headers;
    return config;
  },
  (error) => {
    // 处理请求错误
    ElMessage({
      type: "error",
      message: "请求错误！！！",
    });
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const responseData = response?.data;
    const errorCode = responseData?.code;
    const msg = responseData?.msg;
    if (errorCode != "200") {
      switch (errorCode) {
        case 401:
          if (!isRelogin.show) {
            isRelogin.show = true;
            ElMessageBox.confirm("登录状态已过期，请重新登录", "系统提示", {
              confirmButtonText: "重新登录",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                isRelogin.show = false;
                router.push({
                  path: "/",
                });
              })
              .catch(() => {
                isRelogin.show = false;
              });
          }
          return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
        case 500:
          ElMessage({
            type: "error",
            message: msg ? msg : "服务器错误！",
          });
          return null;
        default:
          ElMessage({
            type: "error",
            message: msg ? msg : "服务器错误！",
          });
      }
    }

    // 对响应数据进行处理
    return response;
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default instance;
