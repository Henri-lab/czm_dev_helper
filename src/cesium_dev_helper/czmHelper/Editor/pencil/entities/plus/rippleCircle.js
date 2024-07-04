import * as Cesium from "cesium";
import { CoordTransformer } from "../../../../Compute";
import { objHasOwnProperty, setProperties, createGraphics } from "./index";
export function RippleCircleEntity(extraOption, options, datasource) {
  if (options && options.center) {
    let entity = createGraphics(),
      $this = this;

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
        $this.transformWGS84ToCartesian(_center),
        new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(heading),
          Cesium.Math.toRadians(pitch),
          Cesium.Math.toRadians(roll)
        )
      );
    }, false);

    // Define ellipse graphics for the entity
    entity.ellipse = this.EllipseGraphics(dynamicOpt);

    // Add entity to the graphics layer
    return this._graphicsLayer.entities.add(entity);
  }
}