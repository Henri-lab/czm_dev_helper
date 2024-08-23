<template>
    <div class="descriptions">
        <el-button class="add" @click="addTable">添加表单</el-button>
        <!-- tableList 添加表-->
        <div v-for="(table, table_i) in tableList " :key="table.id">
            <!-- 雷达说明表 -->
            <el-descriptions class="margin-top" title="雷达" :column="3" border v-if="table.facilityType == -1">
                <template #title>
                    <div class="descrTitle">
                        <span>雷达</span>
                        <span style="cursor: pointer" @click="remDescr(table)">删除</span>
                    </div>
                </template>


                <!-- opt 是数据字段 -->
                <el-descriptions-item v-for="(opt, opt_i) in table.data" :key="opt.id" :span="opt.span">
                    <!-- 字段名称 -->
                    <template #label>
                        <div class="cell-item">
                            {{ opt.name }}
                        </div>
                    </template>
                    <!-- 字段类型 textarea 输入框-->
                    <!-- --------------------------装备、诱饵  -->
                    <el-input v-if="opt.type == 'textarea'" type="textarea" v-model="opt.value" :title="opt.value"
                        auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }" @change="setManuRadarParam(table, opt)">
                    </el-input>
                    <!--字段名称 雷达型号 ； 字段类型 下拉框+输入框  @hf-->
                    <el-select v-if="opt.name === '雷达型号'" style="width: 180px" v-model="selRadars[table_i]"
                        :placeholder=selRadars[table_i] @change="completeRadarParams(table, table_i, $event)" allow-create
                        filterable>
                        <el-option v-for="type_ in radarTypes" :key="type_" :label="type_" :value="type_" />
                    </el-select>
                    <!-- 字段类型 自动补全 输入框 @hf-->
                    <el-input v-if="opt.type == 'text-auto'" v-model="opt.value" placeholder="">
                    </el-input>
                    <!-- 字段类型 普通 输入框-->
                    <el-input v-if="opt.type == 'text-basic'" v-model="opt.value" :title="opt.value" allow-create
                        filterable>
                    </el-input>
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>
<script setup>
import { _template_, wrapObj, tableConfig as tbInit } from './config';
import { getRadar } from '@/api/facility';

const tableList = ref([]);
// 添加设施或雷达 - 空白表单-带渲染方式 -
const addTable = () => {
    tableList.value.push(tbInit);
    // console.log(tableList.value, `table*${tableList.value.length}`)
};

// < radar参数生成 @hf
const db_RadarTypes = ref([]);
const db_Radars = ref([]);//数据库已有radar(数据库缓存)
const selRadars = [];
const getAllRadarInfos = async () => {
    console.log('get all radar infos ')
    const res = await getRadar()
    if (res.code != 200) return
    const radarInfos = res.data
    db_RadarTypes.value = radarInfos.map(item => item.radar)
    db_Radars.value = radarInfos.map(item => item)
}
onMounted(() => {
    getAllRadarInfos()
})
// 点击option设置雷达类型
function completeRadarParams(table, indexOfTable, selValue) {//传入的值一样的 但是index不同
    table._meta_.selRadar = selValue
    console.log(`set radar type <${table._meta_.selRadar}> 在第${indexOfTable + 1}张表`)
    const res = db_Radars.value.find(item => item.radar == selValue)
    // 查询到了
    if (res) {
        console.log('查询到了')
        console.log(`search <${selValue}> in db :`, res)
        const orderedRes = {}
        Object.keys(_init_).forEach(key => {
            orderedRes[key] = res[key]
        })
        selRadars[indexOfTable] = selValue
        // selRadars.value[indexOfTable] = {
        //   type: selValue,
        //   info: orderedRes
        // }
        table.data = JSON.parse(JSON.stringify(wrapObj(orderedRes)));
    } else {
        console.log('没有查询到')
    }

    console.log(selRadars, '每张表应该的radar选项!!')
    console.log('每张表实际的radar选项:')
    tableList.value.forEach(item => console.log(item._meta_.selRadar, ','))
    console.log(tableList.value, '目前 所有表')
}
// @hf>


</script>
<style lang="scss">
@import './index.scss'
</style>
