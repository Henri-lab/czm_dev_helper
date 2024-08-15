<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(_route_, index) in breadcrumbList" :key="_route_.path">
        <!-- 死 -->
        <span v-if="_route_.redirect === 'noRedirect' || index == breadcrumbList.length - 1" class="no-redirect">
          {{ _route_.meta.title }}
        </span>
        <!-- 活 -->
        <a v-else @click.prevent="handleLink(_route_)">{{ _route_.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
const route = useRoute();
const router = router();
const breadcrumbList = ref([])

function getBreadcrumbList() {
  // only show routes with meta.title
  let matched = route.matched.filter(item => item.meta && item.meta.title);
  const first = matched[0]
  // 判断是否为首页
  if (!isDashboard(first)) {
    matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
  }

  breadcrumbList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}
// 首页 判断器 (首页的名字为'Index')
function isDashboard(route) {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim() === 'Index'
}
// 跳转 有重定向路径就跳到重定向路径 否则跳到path
function handleLink(item) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

// if you go to the redirect page, do not update the breadcrumbs
watchEffect(() => {
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumbList()
})

</script>

<style lang='scss' scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>