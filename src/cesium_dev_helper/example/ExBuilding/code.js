export default
    `
<template>
    <div class="ex2">
        <div class="ex1" style="display: flex;flex-direction: column;">
            <div class="btns" style="display: flex; flex-direction: column; width: 200px;">
                <el-button @click="handleCollapse">坍塌切换</el-button>
                <br>
                Sphere聚合阈值
                <el-input v-model="input" placeholder=">=0" />
                <el-button @click="handleThreshold" round>确认</el-button>
                <el-button @click="threshold = -1" round>取消</el-button>
                <br>
                Label聚合阈值
                <el-input v-model="input2" placeholder=">=0" />
                <el-button @click="handleThreshold2" round>确认</el-button>
                <el-button @click="threshold = -1" round>取消</el-button>
                <br>
                <span style="background-color: antiquewhite;">
                    一级损伤：{{ ids }}
                    <br>
                    二级损伤：{{ ids2 }}
                    <br>
                    三级损伤：{{ ids3 }}
                </span>
            </div>
            <CzmMap name="wuhan123" :option="tecent" width="800px" height="1000px">
                <Entity>
                    <!-- <Model :option="option" :tileset="tileset"></Model> -->
                    <Model :option="option" :collapse="collapse"></Model>
                    <Sphere :options="sphereOpts" :center="center" cluster :threshold="threshold"></Sphere>
                    <Label :options="labelOpts" cluster :threshold="threshold2"></Label>
                    <Particle group :positions="particlePos" :image="particleImg"></Particle>
                    <Particle group :positions="particlePos2" :image="particleImg2"></Particle>
                    <Particle group :positions="particlePos3" :image="particleImg3"></Particle>
                </Entity>
            </CzmMap>
        </div>

    </div>
</template>
`