
//查询日期的星期数:例如2024-04-11;
export default function getFormatDay(format) {
    const date = new Date(format);
    const options = { weekday: 'long' };
    const day = new Intl.DateTimeFormat('zh-CN', options).format(date);
    return day
}