<template>
  <div class="container">
    <h3>当前城市</h3>
    <button @click="backCurrentCity">{{ $store.city }}</button>
    <h3>定位/最近访问</h3>
    <div>
      <button class="location"><i class="iconfont icon-weizhi"></i> 武汉市</button>
      <button v-for="item of historyCities" :key="item" @click="getcityname(item)">
        {{ item }}
      </button>
    </div>
    <h3>热门城市</h3>
    <div>
      <button @click="handleItem(item.name)" v-for="item of hotCities" :key="item.name">
        {{ item.name }}
      </button>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
