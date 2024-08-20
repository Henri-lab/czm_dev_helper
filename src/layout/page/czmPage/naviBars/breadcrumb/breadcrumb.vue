<template>
  <a-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <a-breadcrumb-item
        v-for="(item, index) in levelList"
        :key="item.path"
        :class="{ 'no-redirect': item.redirect === 'noRedirect' || index === levelList.length - 1 }"
      >
        <template v-if="item.redirect === 'noRedirect' || index === levelList.length - 1">
          {{ item.meta.title }}
        </template>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </a-breadcrumb-item>
    </transition-group>
  </a-breadcrumb>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const levelList = ref([]);

function getBreadcrumb() {
  // 只显示包含 meta.title 的路由
  let matched = route.matched.filter(item => item.meta && item.meta.title);
  const first = matched[0];
  // 判断是否为首页
  if (!isDashboard(first)) {
    matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched);
  }

  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
}

function isDashboard(route) {
  const name = route && route.name;
  if (!name) {
    return false;
  }
  return name.trim() === 'Index';
}

function handleLink(item) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect);
    return;
  }
  router.push(path);
}

watchEffect(() => {
  // 如果路径以 /redirect/ 开头，则不更新面包屑
  if (route.path.startsWith('/redirect/')) {
    return;
  }
  getBreadcrumb();
});

getBreadcrumb();
</script>

<style lang='scss' scoped>
.app-breadcrumb {
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
