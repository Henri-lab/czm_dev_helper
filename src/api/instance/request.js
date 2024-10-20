import axios from 'axios'
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken } from '@/util/cookie'
import errorCode from '@/util/errorCode'
import { tansParams } from '@/util/format'
import { isBlob } from '@/util/valid'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'
import useUserStore from '@/store/modules/user'


// 是否显示重新登录 (default：false)
export let isRelogin = { show: false };

//发送数据为JSON格式，编码方式为UTF-8
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

/**
 * @description: axios实例 检测token 节流
 */
// 创建axios实例
const instance = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,/* /dev */
  // 超时
  timeout: 10000
})
const interval = 1000; // 节流 间隔时间(ms)，小于此时间视为重复提交
// request拦截器
instance.interceptors.request.use(
  config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false

    if (isToken && getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    // 如果是GET请求，则映射params参数为url格式
    if (config.method === 'get' && config.params) {
      let _url = config.url + '?' + tansParams(config.params);
      config.params = {};//防止干扰其他请求参数的解析
      config.url = _url;
    }


    // 检查是否为POST或PUT请求、重复提交 
    // --满足条件 则将请求进行session缓存 
    // --不满足 则返回错误
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      // 创建一个请求对象，包含URL、数据（如果是对象，则转换为JSON字符串）、时间戳
      const requestObj = {
        url: config.url,
        // 如果data是对象，则将其转换为JSON字符串；否则直接使用data
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        // 添加当前时间的时间戳
        time: new Date().getTime()
      };

      // 从缓存中获取会话对象
      const sessionObj = cache.session.getJSON('sessionObj');

      // 如果会话对象不存在或为空，
      // --则将当前请求对象 直接 缓存至session
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj);
      } else {
        //如果缓存中的session已经存在这个请求 并且 在约定间隔内重复发送
        // --则视为假请求 直接返回错误 
        const s_url = sessionObj.url;                // 请求地址
        const s_data = sessionObj.data;              // 请求数据
        const s_time = sessionObj.time;              // 请求时间
        if (s_url === requestObj.url && s_data === requestObj.data && requestObj.time - s_time < interval) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          //否则 视为真请求
          // --将当前请求对象 更新缓存在session
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }
    return config
  },
  error => {
    console.log('Request interceptor error:', error)
    Promise.reject(error)
  })

// 响应拦截器
instance.interceptors.response.use(
  res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']

    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }
    // 状态码处理
    if (code === 401) {
      //未授权
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          isRelogin.show = false;
          useUserStore().logOut().then(() => {
            location.href = '/index';
          })
        }).catch(() => {
          isRelogin.show = false;
        });
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElNotification.error({ title: msg })
      return Promise.reject(new Error(msg))
    } else {
      // 成功拿到数据
      return Promise.resolve(res.data)
    }
  },
  // 服务器响应异常处理
  error => {
    console.log('Response interceptor error:' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    console.error(message)
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)


/**
 * 下载文件
 * @param {string} url - 下载请求的URL
 * @param {object} params - 请求体参数
 * @param {string} filename - 文件名
 * @param {object} [config] - 额外的配置选项
 * @example 
   download('/api/download-file', { fileId: 123456 }, 'example.pdf').then(() => {
     console.log('文件下载成功');
   }).catch((error) => {
     console.error('文件下载失败:', error);
   });
 */
export async function download(url, params, filename, config) {
  // 显示加载提示
  let downloadLoadingInstance = ElLoading.instance({
    text: "正在下载数据，请稍候",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    // 发送POST请求并获取数据
    const data = await instance.post(
      url,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // URL编码 (Key&Value, 转义)
        },
        transformRequest: [(params_) => { return tansParams(params_) }],
        responseType: 'blob',
        ...config
      }
    );

    // 检查是否为有效的Blob数据
    const is_Blob = isBlob(data);
    if (is_Blob) {
      // 创建Blob对象并保存到本地
      const blob = new Blob([data]);
      saveAs(blob, filename);
    } else {
      // 如果不是Blob数据，则解析错误信息
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
      ElMessage.error(errMsg);
    }

    // 关闭加载提示
    downloadLoadingInstance.close();
  } catch (err) {
    console.error(err);
    ElMessage.error('下载文件出现错误，请联系管理员！');
    downloadLoadingInstance.close();
  }
}

export default instance
