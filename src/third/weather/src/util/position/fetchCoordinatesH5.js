// 🧭定位--根据user所在位置更新view的center

// 📌1.获取user的H5坐标
const getGeolocationH5 = () => {
    // --'返回坐标'的Promise:方便await/then;
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    weiH5: position.coords.latitude,
                    jingH5: position.coords.longitude
                })
            },
            (error) => {
                reject(error)
            }
        )
    })
}
// 📌2.更新mapStore经纬度状态
const fetchCoordinatesH5 = async () => {
    try {
        const { weiH5, jingH5 } = await getGeolocationH5()
        if (jingH5 && weiH5) {
            return {
                jingH5,
                weiH5
            }
        }
    } catch (error) {
        console.error('Error getting location:', error)
    }
}

export { fetchCoordinatesH5 }