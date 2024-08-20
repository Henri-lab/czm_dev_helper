import { createRouter, createWebHistory } from 'vue-router'
import CitySearch from '@/views/CitySearch.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        citySearchAndWeather: CitySearch,
      },
      meta: {
        name: 'home'
      },
    },
    {
      path: '/live/adcode=:adcode/cityName=:cityName',
      name: 'live',
      components:
      {
        citySearchAndWeather: () => import('@/views/WeatherLive.vue'),
      },
      meta: {
        name: 'live',
        enabled: true//route-flag是否挂载添加按钮
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      redirect: '/'
    }

  ]
})

export default router
