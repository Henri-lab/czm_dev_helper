<!-- HTTP Live Streaming -->

<template>
  <video-player
    :poster="poster"
    crossorigin="anonymous"
    :controls="true"
    :loop="true"
    :volume="0.6"
    :techOrder="['html5', 'flvjs']"
    autoplay="true"
    width="500px"
    height="300px"
    @mounted="handleMounted"
  />
</template>

<script setup>
import { VideoPlayer } from '@videojs-player/vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { ref } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default:
      'http://v2h.jdshipin.com/asia_action/asia_action.stream/chunklist.m3u8',
  },
  videoType: {
    type: String,
    default: 'hls',
  },
});

const handleMounted = ({ player }) => {
  if (props.videoType === 'hls') {
    console.log('HLS Live player mounted', player);
    player.src(props.src);
  } else if (props.videoType === 'flv') {
    // flv.js runs only in the browser environment and does an asynchronous processing for SSR prerender.
    import('/src/cesiumTools/flvjs-tech.js').then(({ FlvJsTech }) => {
      console.log(FlvJsTech);
      videojs.registerTech('Flvjs', FlvJsTech);
      player.src(props.src);
    });
  }
};
</script>

<style lang="scss" scoped></style>
