import {
    gifLoader,
    Cesium,
    CoordTransformer,
    objHasOwnProperty,
    setProperties,
    createGraphics,
} from './index';


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

export function RippleCircleEntity(extraOption, options, datasource) {
  if (options && options.center) {
    let entity = createGraphics()

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