export function mockPointsMillion(container, { x, y, z } = { x: 2.294481, y: 48.858370, z: 20 }) {
    // 测试模式 生成一百万个示例点 
    const baseLongitude = x;//基准点 base
    const baseLatitude = y;
    const baseHeight = z;
    const colorArray = [
        Cesium.Color.RED,
        Cesium.Color.GREEN,
        Cesium.Color.BLUE
    ];
    for (let i = 0; i < 1000000; i++) {
        const longitudeOffset = (Math.random() - 0.5) * 5; // 经度偏移
        const latitudeOffset = (Math.random() - 0.5) * 5; // 纬度偏移
        const heightOffset = (Math.random() - 0.5) * 750000;
        // 构建点的位置和颜色
        const position = Cesium.Cartesian3.fromDegrees(
            baseLongitude + longitudeOffset,
            baseLatitude + latitudeOffset,
            baseHeight + heightOffset
        );
        // 随机选择颜色
        const color = colorArray[i % colorArray.length];
        // 添加点到集合
        container.add({
            position: position,
            color: color,
            pixelSize: 5,
            scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 5000, 0.2),
        });
    }
    return container;
}