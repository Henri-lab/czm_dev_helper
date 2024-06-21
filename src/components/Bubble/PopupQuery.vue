<!-- 气泡框的vue组件 -->
<template>
    <div class="window-container">
        <i class="iconfont metro-subway subIcon"></i>
        <div class="window-content">
            <div class="window-header">
                <span class="window-title">{{ label }}</span>
            </div>
            <div class="window-body">
                <span class="window-close" title="关闭" @click="closeClick"></span>
                <div class="window-info">
                    <div v-for="(field, index) in fields" :key="index" class="window-info-item">
                        <span class="window-info-label">{{ field }}：</span>
                        <span class="window-info-text">{{ formatValue(values[index]) }}</span>
                    </div>
                </div>
                <img src="/src/assets/uiResources/subway.jpeg" alt="" class="banner-img">
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    label: {
        type: String,
        default: "标题"
    }, values: {
        type: Array,
        default() {
            return [];
        }
    },
    fields: {
        type: Array,
        default() {
            return [];
        }
    },
    closePopup: {
        type: Function,
        default: () => { }
    }
})
const formatValue = (val) => {
    if (val.length > 30) {
        return val.substr(0, 30);
    }

    return val;
}

const closeClick = () => {
    props.closePopup && props.closePopup()
}
</script>
  
<style lang="css" scoped>
.window-container {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 500px;
    height: 400px;
    color: white;
    background: url('/src/assets/uiResources/popup.png');
    background-size: 100% 100%;
    transform: translate(44%, 16%);
    user-select: none;
}

.window-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.window-header {
    width: 100%;
    margin-top: 30px;
    margin-left: 80px;
    font-size: 22px;
    height: 20px;
}

.window-body {
    flex: 1;
    padding-top: 40px;
    padding-left: 55px;
    display: flex;
}

.window-info{
    width: 200px;
}

.window-info-item {
    font-size: 16px;
    margin: 10px 0;
}

.window-info-label{
    display: inline-block;
    min-width: 100px;
}

.window-close {
    position: absolute;
    right: 2px;
    top: 89px;
    width: 22px;
    height: 22px;
    background: url('/src/assets/uiResources/close.png');
    background-size: 100% 100%;
    cursor: pointer;
}

.window-close:hover {
    background-color: #b8871a;
}


.banner-img {
    width: 220px;
    height: 180px;
}

.subIcon {
    position: absolute;
    font-size: 25px;
    color: #fff;
    left: 21px;
    top: 30px;
}
</style>