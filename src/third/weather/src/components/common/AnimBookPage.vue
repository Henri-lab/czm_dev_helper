<template>  
  <div class="book-page" :class="{ 'flipped': isFlipped }" @click="flipPage">  
    <!-- 这里是你的书页内容 -->  
    
  </div>  
</template>  
  
<script>  
import { ref } from 'vue';  
  
export default {  
  setup() {  
    const isFlipped = ref(false);  
  
    const flipPage = () => {  
      isFlipped.value = !isFlipped.value;  
    };  
  
    return {  
      isFlipped,  
      flipPage,  
    };  
  },  
};  
</script>  
  
<style scoped>  
.book-page {  
  width: 200px;  
  height: 300px;  
  background-color: #f4f4f4;  
  position: relative;  
  perspective: 1000px; /* 3D效果透视效果 */  
  transition: transform 0.5s ease-in-out; /* 平滑过渡效果 */  
  transform-style: preserve-3d; /* 保持子元素在3D空间中 */  
  backface-visibility: hidden; /* 背面不可见 */  
}  
  
.book-page.flipped {  
  transform: rotateY(180deg);  
}  
</style>