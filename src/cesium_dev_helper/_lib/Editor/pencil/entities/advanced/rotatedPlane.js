import {
    gifLoader,
    Cesium,
    CoordTransformer,
    objHasOwnProperty,
    setProperties,
    createEntity,
} from './index';


export function RotatedPlaneEntity(extraOption, options, datasource) {
    if (options && options.center && options.positions) {
        let entity = {},
            index = 0,
            positions = options.positions,
            _position = positions[0],
            _center = options.center,
            _plane = new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0);// 默认的固定平面

        entity.position = new Cesium.CallbackProperty(function () {
            _position = positions[index];
            index = (index + 1) % positions.length;//更新索引;   索引顺序:0,1,2,~len-1,0~len-1,...
            return _position;
        }, false);

        if (options.isRotated/* 如果开启旋转 */) {
            // 平面随着 _center 和 _position 的变化而实时更新
            _plane =
                new Cesium.CallbackProperty(function () {
                    // 计算法向量
                    let normal = Cesium.Cartesian3.normalize(
                        Cesium.Cartesian3.subtract(_center, _position, new Cesium.Cartesian3()), new Cesium.Cartesian3()
                    )
                    //  返回Plane对象
                    return Cesium.Plane.fromPointNormal(_position, normal)
                }, false)
        }

        const planeOpt = {
            plane: _plane,
            dimensions: options.dimensions || new Cesium.Cartesian2(200.0, 150.0),
            material: new Cesium.ImageMaterialProperty({
                image: options.image
            })
        };
        entity.plane = PlaneGraphics(planeOpt)

        const finalEntity = {
            ...extraOption,
            ...entity
        };
        return datasource.entities.add(finalEntity)
    }
}