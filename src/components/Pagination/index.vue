<template>
  <div :class="{ 'hidden': hidden }" class="pagination-container">
    <el-pagination :background="background" :current-page="currentPage" :page-size="pageSize" :layout="layout"
      :page-sizes="pageSizes" :pager-count="pagerCount" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

  </div>
</template>

<script setup>
import { scrollTo } from '@/util/scrollTo'

const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    // 一般来说，响应式设计中的断点可能会包括但不限于以下几种常见值：
    // -小屏手机(如 iPhone SE)：大约 320px 至 480px
    // -中屏手机(如 iPhone 11)：大约 481px 至 768px
    // -平板(如 iPad)：大约 768px 至 1024px
    // -桌面显示器：大于 1024px
    default: document.body.clientWidth < 1024 ? 5 : 7
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits();
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})
function handleSizeChange(val) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
function handleCurrentChange(val) {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}

</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>

<!-- 示例 -->
<!-- <template>
  <PaginationComponent
    :total="totalRecords"
    :page="currentPage"
    :limit="itemsPerPage"
    :page-sizes="[10, 20, 30, 50]"
    :pager-count="7"
    :layout="'total, sizes, prev, pager, next, jumper'"
    :background="true"
    :auto-scroll="true"
    :hidden="false"
    @pagination="onPaginationChange"
    @update:page="onPageUpdate"
    @update:limit="onLimitUpdate"
  />
</template> -->