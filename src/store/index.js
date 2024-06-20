/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-08 16:11:33
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 16:11:36
 */
import {defineStore} from 'pinia'

export const useLineData=defineStore('lineData',{
    state:()=>{
        return {
            lineData:[]
        }
    },
    getters:{
        // 获取线路显示隐藏信息
        lineDisplay(){
            return this.lineData.map(item=>({name:item.checked,id:item.id,name:item.name}))
        },
        // 获取全部信息
        allData(){
            return this.lineData
        }
    },
    actions:{
        setData(data){
            return new Promise((resolve,reject)=>{
                this.lineData=data.length?data:[]
                resolve(data)
            })
        }
    },
    
})

export const useMeasureData=defineStore('measureData',{
    state:()=>{
        return {
            measureData:[]
        }
    },
    getters:{
        // 获取全部信息
        allData(){
            return this.measureData
        }
    },
    actions:{
        setData(data){
            return new Promise((resolve,reject)=>{
                this.measureData=data.length?data:[]
                resolve(data)
            })
        }
    },
})