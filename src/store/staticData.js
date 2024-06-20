/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-08 14:32:14
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 14:32:14
 */
export const lineColors = [
  "#218acd",
  "#f794bd",
  "#f0c996",
  "#b3cf3c",
  "#e0e0e0",
  "#117241",
  "#f69a09",
  "#9dc0c8",
];
export const changeStations = [
  "钟家村",
  "大智路",
  "王家湾",
  "宏图大道",
  "常青花园",
  "范湖",
  "王家墩东",
  "江汉路",
  "街道口",
  "宗关",
  "码头潭公园",
  "园博园北",
  "巨龙大道",
  "黄浦路",
  "循礼门",
  "武昌火车站",
  "螃蟹岬",
  "徐家棚",
  "岳家嘴",
  "洪山广场",
  "野芷湖",
];
export const historyWarningData = {
  去年: [
    {
      name: "一月",
      value: 130,
    },
    {
      name: "二月",
      value: 150,
    },
    {
      name: "三月",
      value: 150,
    },
    {
      name: "四月",
      value: 131,
    },
    {
      name: "五月",
      value: 151,
    },
    {
      name: "六月",
      value: 163,
    },
    {
      name: "七月",
      value: 230,
    },
    {
      name: "八月",
      value: 155,
    },
    {
      name: "九月",
      value: 130,
    },
    {
      name: "十月",
      value: 111,
    },
    {
      name: "十一月",
      value: 222,
    },
    {
      name: "十二月",
      value: 260,
    },
  ],
  今年: [
    {
      name: "一月",
      value: 110,
    },
    {
      name: "二月",
      value: 120,
    },
    {
      name: "三月",
      value: 130,
    },
    {
      name: "四月",
      value: 111,
    },
    {
      name: "五月",
      value: 151,
    },
    {
      name: "六月",
      value: 123,
    },
    {
      name: "七月",
      value: 210,
    },
    {
      name: "八月",
      value: 135,
    },
    {
      name: "九月",
      value: 110,
    },
    {
      name: "十月",
      value: 101,
    },
    {
      name: "十一月",
      value: 162,
    },
    {
      name: "十二月",
      value: 230,
    },
  ],
};
// 站点管理需要查询的分类
export const stationMangeItems = [
  {
    title: "站点拥挤度",
    icon: "metro-lineRoute",
    id: "lineCrowd",
    active: false,
  },
  {
    title: "周边查询",
    icon: "metro-zhoubian",
    id: "stationAround",
    active: false,
  },
  {
    title: "路径规划",
    icon: "metro-lujingguihua",
    id: "pathDesign",
    active: false,
  },
  {
    title: "站控措施",
    icon: "metro-ditie",
    id: "stationControl",
    active: false,
  },
];

// 重保活动
export const activity = [
  {
    id: 3,
    activedLine:'1号线',
    activity: "领导参观",
    activedPlace: "长江大桥",
    activedTime: "8:30",
  },
  {
    id: 7,
    activedLine:'1号线',
    activity: "足球赛",
    activedPlace: "体育场",
    activedTime: "10:30",
  },
  {
    id: 12,
    activedLine:'1号线',
    activity: "领导巡视",
    activedPlace: "大学",
    activedTime: "14:30",
  },
  {
    id: 14,
    activedLine:'1号线',
    activity: "露天演出",
    activedPlace: "景区",
    activedTime: "16:30",
  }
];

// 站控措施
export const station_solutions=[
  {
    title:'重保',
    iconName:'metro-yibao'
  },
  {
    title:'安检',
    iconName:'metro--control'
  },{
    title:'封站',
    iconName:'metro-jinzhi'
  },{
    title:'分批放行乘客',
    iconName:'metro-yonghu'
  },{
    title:'设立导流围栏',
    iconName:'metro-fence-full'
  },{
    title:'关闭部分进站闸机',
    iconName:'metro-zhaji'
  },{
    title:'减缓售票速度',
    iconName:'metro-shoupiao'
  },{
    title:'改变电梯运行方向',
    iconName:'metro-dianti'
  },{
    title:'引导乘客分流',
    iconName:'metro-code-branch'
  }
]
