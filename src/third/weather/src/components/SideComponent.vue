<template>
  <div class="animation">
    <section>
      <h1>dark mode</h1>
      <svg
        id="dark_mode"
        ref="darkMode"
        width="55"
        height="55"
        viewBox="0 0 55 55"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="moon"
          d="M 27.5 0 C 34.791 0 41.79 2.899 46.945 8.055 C 52.101 13.21 55 20.209 55 27.5 C 55 34.791 52.101 41.79 46.945 46.945 C 41.79 52.101 34.791 55 27.5 55 C 20.209 55 13.21 52.101 8.055 46.945 C 2.899 41.79 0 34.791 0 27.5 C 0 20.209 2.899 13.21 8.055 8.055 C 13.21 2.899 20.209 0 27.5 0 Z"
          fill="#fee140"
        />
      </svg>
    </section>
  </div>
</template>

<script setup>
import { ref ,onMounted} from 'vue'
import anime from 'animejs/lib/anime.es.js'
const moonPath =
  'M 27.5 0 C 34.791 0 41.79 2.899 46.945 8.055 C 52.101 13.21 55 20.209 55 27.5 C 55 34.791 52.101 41.79 46.945 46.945 C 41.79 52.101 34.791 55 27.5 55 C 20.209 55 13.21 52.101 8.055 46.945 C 2.899 41.79 0 34.791 0 27.5 C 0 20.209 2.899 13.21 8.055 8.055 C 13.21 2.899 20.209 0 27.5 0 Z'
const sunPath =
  'M 27.5 0 C 34.791 0 41.79 2.899 46.945 8.055 C 33.991 9.89 26.93 20.209 26.93 27.5 C 26.93 34.791 33.689 45.261 46.945 46.945 C 41.79 52.101 34.791 55 27.5 55 C 20.209 55 13.21 52.101 8.055 46.945 C 2.899 41.79 0 34.791 0 27.5 C 0 20.209 2.899 13.21 8.055 8.055 C 13.21 2.899 20.209 0 27.5 0 Z'
const darkMode = ref(null)
let toggle = false
onMounted(() => {  
  const svgElement = darkMode.value // 获取 SVG DOM 元素  
  if (svgElement) {  
    svgElement.addEventListener('click', () => {  
      toggle = !toggle // 切换状态  
  
      const timeline = anime.timeline({  
        duration: 750,  
        easing: 'easeOutExpo'  
      })  
  
      timeline  
        .add({  
          targets: '.moon',  
          d: [{ value: toggle ? moonPath : sunPath }],  
          duration: 750, // 可能需要指定 duration  
          easing: 'easeOutExpo' // 可能需要指定 easing  
        })  
        .add({  
          targets: '#dark_mode',  
          rotate: toggle ? 0 : 320,  
          duration: 350, // 因为 '-=350'，所以这里的时间应该是 750 - 350 = 400，但您指定了 350  
          easing: 'easeOutExpo' // 可能需要指定 easing  
        }, '-=350') // 在前一个动画执行了 350ms 后开始  
  
      // 如果有其他动画，可以在这里继续添加  
  
    })  
  }  
})  
</script>

<style scoped>
.animation{
    width: 500px;
    height: 500px;
}
/*  */
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
legend {
  display: none;
}

html,
body {
  font-family: 'Noto Sans KR', sans-serif;
  width: 100%;
  height: 100%;
  background: #fff;
}
#dark_mode {
  width: 100px;
  height: 100px;
}
#light_mode {
  width: 28px;
  height: 55px;
}
section {
  height: 100vh;
  background: rgba(199, 199, 199);
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}
section h1 {
  font-size: 60px;
  font-weight: bold;
}
svg {
  cursor: pointer;
}
</style>
