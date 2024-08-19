<!--标绘简单的文本-->
<template>
  <!-- <div class="LabelPlot-container" :style="{ backgroundColor: resColor }" @click="onClick"
    :class="{ 'is-selected': isSelected }">
    <i class="iconfont metro-ly_huancheng" style="color: #fff; font-size: 20px" v-if="props.isChange"></i>
    <span class="info-item">{{ label }}</span>
    <div class="measure-wrapper" v-if="measures.length">
      <div class="icon" v-for="item in measures">
        <i :class="['iconfont', item.iconName]" style="color: #fff; font-size: 20px"></i>
      </div>
    </div>
  </div> -->
ssss
  <div class="LabelPlot-container" :style="{ backgroundColor: resColor }" @click="onClick"
    :class="{ 'is-selected': isSelected }">
    <i class="iconfont metro-ly_huancheng" style="color: #fff; font-size: 20px"></i>
    <span class="info-item">{{ label }}</span>
    <div class="measure-wrapper">
      <div class="icon" v-for="item in measures">
        <i :class="['iconfont', item.iconName]" style="color: #fff; font-size: 20px"></i>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
// import { useMeasureData } from '@/store';
// const measureDataStore = useMeasureData()

const measures = ref([])
onMounted(() => {
  console.log('Mounted')
 
})

// measureDataStore.$onAction(
//   ({
//     name, // action 的名字
//     store, // store 实例
//     args, // 调用这个 action 的参数
//     after, // 在这个 action 执行完毕之后，执行这个函数
//     onError, // 在这个 action 抛出异常的时候，执行这个函数
//   }) => {
//     after((result) => {
//       if (result.length) {
//         // 找到对应的站控措施
//         result.forEach(item => {
//           const target = item.find(n => n.name === props.label)
//           if (target) {
//             console.log(target.measures);
//             measures.value = target.measures
//           }
//         })
//       }
//     });
//   }
// );

// const props = defineProps({
//   label: {
//     type: String,
//     default: "",
//   },
//   color: {
//     type: String,
//     default: "",
//   },
//   isChange: {
//     type: Number,
//     default: 0,
//   },
//   position: {
//     type: Object,
//     default: {},
//   },
//   attr: {
//     type: Object,
//     default: {},
//   },
//   clickCallback: {
//     type: Function,
//     default: () => { }
//   }
// });
// const isSelected = ref(false);

// const resColor = computed(() => {
//   if (props.isChange) {
//     return "rgba(255, 0, 0,.4)";
//   } else {
//     return getHexOpacityColor({ color: props.color, opacity: 0.8 });
//   }
// });

// const getHexOpacityColor = ({ color = "#000", opacity = 0.5 }) => {
//   opacity = Math.max(opacity, 0);
//   opacity = Math.min(opacity, 1);
//   color = color.replace(/\#/g, "").toUpperCase();
//   if (color.length === 3) {
//     let arr = color.split("");
//     color = "";
//     for (let i = 0; i < arr.length; i++) {
//       color += arr[i] + arr[i]; //将简写的3位字符补全到6位字符
//     }
//   }
//   let num = Math.round(255 * opacity); //四舍五入
//   let str = "";
//   let arrHex = [
//     "0",
//     "1",
//     "2",
//     "3",
//     "4",
//     "5",
//     "6",
//     "7",
//     "8",
//     "9",
//     "A",
//     "B",
//     "C",
//     "D",
//     "E",
//     "F",
//   ]; //十六进制数组
//   while (num > 0) {
//     let mod = num % 16;
//     num = (num - mod) / 16;
//     str = arrHex[mod] + str;
//   }
//   if (str.length == 1) str = "0" + str;
//   if (str.length == 0) str = "00";
//   return `#${color + str}`;
// };

// const onClick = () => {
//   props.clickCallback && props.clickCallback(measures.value)
// };


</script>

<style scoped>
.measure-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
}

.icon {
  display: inline-block;
  padding: 3px 10px;
  font-size: 10px;
  margin: 0 4px;
  background: url("/src/assets/uiResources/button.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  cursor: pointer;
  pointer-events: all;
}

.LabelPlot-container {
  position: absolute;
  left: 0px;
  bottom: 0px;
  cursor: default;
  padding: 5px;
  border: 1px solid #9c9944d3;
  color: #fff;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  cursor: pointer;
  user-select: none;
}

.info-item {
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.LabelPlot-container:hover {
  border: 1px solid rgb(9, 255, 0);
}
</style>
