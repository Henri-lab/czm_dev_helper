import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/util/cookie'
import { isHttp } from '@/util/valid'
import { isRelogin } from '@/api/instance/request'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'
import useSettingsStore from '@/store/modules/settings'

NProgress.configure({ showSpinner: false });//进度条 配置

// 给router添加守卫 白名单whiteList上的路径即使没有token也可以自由访问
export const setPermissionGuardExclude = (router, whiteList = ['/login', '/register']) => {
    // 守卫
    router.beforeEach((to, from, next) => {
        NProgress.start() // 🔄

        if (getToken()) { // 查看 判断用户Cookie 是否有 token
            /* 用户有token */
            to.meta.title && useSettingsStore().setTitle(to.meta.title) // 设置页面标题

            if (to.path === '/login') {
                // 如果目标路径为登录页，则重定向到首页
                next({ path: '/' })
                NProgress.done()//✅
            } else {
                if (useUserStore().roles.length === 0) { // 如果 不确定 用户角色 
                    isRelogin.show = true // 显示重新登录提示  


                    // 获取用户信息   确定 用户角色
                    useUserStore().getInfo().then(() => {
                        isRelogin.show = false // 隐藏重新登录提示
                        usePermissionStore().generateRoutes().then(accessRoutes => {
                            // 根据用户角色生成可访问的路由表
                            accessRoutes.forEach(route => {
                                // 将非HTTP链接放入vue路由系统
                                if (!isHttp(route.path)) {
                                    router.addRoute(route)
                                }
                            })
                            next({ ...to, replace: true }) // 确保动态添加的路由生效
                        })
                    }).catch(err => {
                        // 有tooken但是获取不到用户信息 则强制登出
                        useUserStore().logOut().then(() => {
                            ElMessage.error(err) // 显示错误消息
                            next({ path: '/' }) // 重定向到首页
                        })
                    })
                } else {
                    next() // 用户已登录且有角色信息，允许继续导航
                }
            }
        } else {
            // 用户没有token
            if (whiteList.indexOf(to.path) !== -1) {
                // 目标路径在白名单内，允许直接访问
                next()
            } else {
                next(`/login?redirect=${to.fullPath}`) // 重定向到登录页，并携带重定向后的路径
                NProgress.done() //✅
            }
        }
    })


    router.afterEach(() => {
        NProgress.done() //✅
    })
}




