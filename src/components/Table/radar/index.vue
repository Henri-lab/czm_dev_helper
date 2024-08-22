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
                        :placeholder=selRadars[table_i] @change="setSelRadarType(table, table_i, $event)" allow-create
                        filterable>
                        <el-option v-for="type_ in radarTypes" :key="type_" :label="type_" :value="type_"
                            @click="getCurRadarParamsByType(table, table_i)" />
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
import { getRadar } from '@/api/';

const tableList = ref([]);
// 添加设施或雷达 - 空白表单-带渲染方式 -
const addTable = () => {
    tableList.value.push(tbInit);
    // console.log(tableList.value, `table*${tableList.value.length}`)
};


// < radar参数生成 @hf
const radarTypes = ref([]);;//数据库已有radar的类型(数据库缓存)
const db_Radars = ref([]);//数据库已有radar的全部信息(数据库缓存)
let manuRadar = _template_;//初始化  赋值表单渲染源 
const selRadars = ref([]);//每个表单的雷达类型选择
const getAllRadarInfos = async () => {
    console.log('get all radar infos ')
    const res = await getRadar()
    if (res.code != 200) return
    const radarInfos = res.data
    radarTypes.value = radarInfos.map(item => item.radar)
    db_Radars.value = radarInfos.map(item => item)
}
onMounted(() => {
    getAllRadarInfos()
})
// 点击option设置雷达类型
function setSelRadarType(table, indexOfTable, selValue) {//传入的值一样的 但是index不同
    selRadars.value[indexOfTable] = selValue
    table._meta_.selRadar = selRadars.value[indexOfTable]
    console.log(`set radar type <${table._meta_.selRadar}> 在第${indexOfTable + 1}张表`)
    manuRadar['radar'] = selValue
    table.data = wrapObj(manuRadar)
    console.log(table.data, 'table.data')
}

// 根据 雷达类别 返回 雷达参数 
const getCurRadarParamsByType = async (table, indexOfTable) => {
    const type = selRadars.value[indexOfTable]
    // update every tableMeta
    const res = db_Radars.value.find(item => item.radar == type)
    console.log(`search <${type}> in db :`, res)
    console.log(selRadars.value, 'selRadars')
    console.log(tableList.value.map(item => item._meta_.selRadar), '每张表的radar选项')
};


</script>
<style lang="scss">
@import './index.scss'
</style>
