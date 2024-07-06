import { Cesium, createGraphics, } from './index';
import { PathGraphics } from '../../graphics/index';

export function SampleEntity(extraOption, options, datasource, viewer) {
    const {
        positions,
        startTime,
        speed,
        modelUri,
        scale,
        minimumPixelSize,
        maximumScale,
        pathOptions
    } = options;
    // 为位置坐标 提供 参考时间点
    const property = new Cesium.SampledPositionProperty();
    for (let i = 0; i < positions.length; i++) {
        const time = Cesium.JulianDate.addSeconds(startTime, i / speed, new Cesium.JulianDate());
        // 地理坐标转Cartesian3
        const position = Cesium.Cartesian3.fromDegrees(positions[i].longitude, positions[i].latitude, positions[i].height || 0);
        property.addSample(time, position);
    }

    // 空实体
    let entity = createGraphics();
    // 绑定必备属性
    entity.position = property
    // 自动计算基于速度的方向
    entity.orientation = new Cesium.VelocityOrientationProperty(property)
    entity.model = {
        uri: modelUri,
        scale: scale || 0.5,
        minimumPixelSize: minimumPixelSize || 128,
        maximumScale: maximumScale || 20000,
    }
    entity.path = PathGraphics(pathOptions)

    const sampleEntity = {
        ...extraOption,
        ...entity,
    }
    // 自动跟踪
    viewer.trackedEntity = sampleEntity;

    return datasource.entities.add(sampleEntity)
}