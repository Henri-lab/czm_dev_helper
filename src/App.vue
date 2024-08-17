<template>
  <div class="whole-page">
    <!-- <v-scale-screen width="1920" height="1080" delay="200">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </v-scale-screen> -->

    <!-- test -->
    <!-- <Editor /> -->
    <!-- <LayOut /> -->
    <Login />
  </div>
</template>


<script setup>
// test
import Editor from './components/Editor/index.vue'
import LayOut from './layout/index.vue'
import Login from './views/login/index.vue'

</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
