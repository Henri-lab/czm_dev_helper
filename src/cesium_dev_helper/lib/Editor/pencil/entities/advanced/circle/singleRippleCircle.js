// 仅支持一个动态圆形实体
import { CoordTransformer} from '../index';

/**
 * Creates a ripple circle entity with dynamic properties.
 *
 * @param {Object} extraOption - Additional options to be merged with the final entity.
 * @param {Object} options - Options for the ripple circle entity.
 * @param {Array} options.center - The center of the ripple circle in WGS84 coordinates.
 * @param {number} [options.radius=800] - The initial radius of the ripple circle.
 * @param {number} [options.rotateAmount=0.05] - The rotation speed of the ripple circle.
 * @param {number} [options.height=1] - The height of the ripple circle.
 * @param {string} [options.image=""] - The image URL for the ripple circle material.
 * @param {Cesium.MaterialProperty} [options.material] - The material property for the ripple circle.
 * @param {number} [options.maxR] - The maximum radius of the ripple circle.
 * @param {number} [options.minR] - The minimum radius of the ripple circle.
 * @param {Cesium.DataSource} datasource - The Cesium data source to add the entity to.
 *
 * @returns {Cesium.Entity} The created ripple circle entity.
 */

export default function singleRippleCircle(extraOption, options, datasource) {
  if (options && options.center) {
    let entity = {}

    // Default options
    const defaultOptions = {
      radius: 800,
      rotateAmount: 0.05,
      height: 1,
      scale: null,
      scale2: null,
      image: "",
      material: new Cesium.ImageMaterialProperty({
        image: "",
        transparent: true
      })
    };

    // Assign default values to options if not provided
    options = { ...defaultOptions, ...options };

    // Circle properties
    let dynamicOpt = {},
      heading = 0,
      pitch = 0,
      roll = 0,
      _center = options.center,
      _radius = options.radius,//动态半径
      _maxR = options.maxR,
      _minR = options.minR,
      _rotateAmount = options.rotateAmount,
      _stRotation = 0,
      _height = options.height,
      _material = options.material || new Cesium.ImageMaterialProperty({
        image: options.image || "",
        transparent: true
      });

    let flag = false;

    // 改变radius的增长方向
    let updateScalerAxis = () => {
      if (_radius >= _maxR || _radius <= _minR) {
        flag = !flag;
      }
      flag ? (_radius -= 2) : (_radius += 2);
    };

    // Dynamic circle options
    dynamicOpt = {
      material: _material,
      height: _height,
      semiMajorAxis: new Cesium.CallbackProperty(function () {
        return _radius;
      }, false),
      semiMinorAxis: new Cesium.CallbackProperty(function () {
        return _radius;
      }, false),
      stRotation:/*旋转角度*/ new Cesium.CallbackProperty(function () {
        if (_rotateAmount > 0) {
          _stRotation += _rotateAmount;
          if (_stRotation >= 360) {
            _stRotation = 0;
          }
        }
        if (_maxR && _minR) updateScalerAxis();
        return _stRotation;
      }, false)
    };

    // Entity position
    entity.position = new Cesium.CallbackProperty(function () {
      return CoordTransformer.transformWGS84ToCartesian(_center);
    }, false);

    // Entity orientation
    entity.orientation = new Cesium.CallbackProperty(function () {
      return Cesium.Transforms.headingPitchRollQuaternion(
        CoordTransformer.transformWGS84ToCartesian(_center),//origin pointPos
        new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(heading),
          Cesium.Math.toRadians(pitch),
          Cesium.Math.toRadians(roll)
        )
      );
    }, false);

    // Define ellipse graphics for the entity
    entity.ellipse = this.EllipseGraphics(dynamicOpt);

    const finalEntity = {
      ...extraOption,
      ...entity,
    };
    // Add entity to the graphics layer
    return datasource.entities.add(finalEntity);
  }
}



// 优点：
// 简单直观：代码结构清晰，功能单一，易于理解和维护。
// 动态变化控制：通过回调函数控制半径和旋转角度的动态变化，简单有效。
// 可扩展性：可以通过 extraOption 轻松扩展实体的其他属性。
// 缺点：
// 功能单一：当前实现仅支持一个动态圆形实体，如果需要添加多个实体，需要额外的逻辑处理。
// 材料属性单一：材质属性由外部提供，内部不支持多样化的材质设置（如颜色渐变）。