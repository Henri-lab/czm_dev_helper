/**
  * Creates an ellipse entity with the provided options.
  *
  * @param {Object} options - The options for creating the ellipse entity.
  * @param {number} [options.longitude] - The longitude of the ellipse's center in degrees. Default is -75.59777.
  * @param {number} [options.latitude] - The latitude of the ellipse's center in degrees. Default is 40.03883.
  * @param {string} [options.name] - The name of the ellipse entity. Default is 'Ellipse Entity'.
  * @param {number} [options.semiMinorAxis] - The semi-minor axis of the ellipse in meters. Default is 10000.
  * @param {number} [options.semiMajorAxis] - The semi-major axis of the ellipse in meters. Default is 20000.
  * @param {number} [options.height] - The height of the ellipse in meters. Default is 0.
  * @param {Object} [options.material] - The material to be used for the ellipse. Default is a solid color material.
  *
  * @returns {Entity} - The created ellipse entity.
  */
export function EllipseEntity(options) {
    const ellipseGraphics = this.EllipseGraphics(options);
    // 创建实体
    let entity = this.createGraphics()
    entity = viewer.entities.add({
        name: options.name || 'Ellipse Entity',
        position: Cesium.Cartesian3.fromDegrees(
            options.longitude || -75.59777,
            options.latitude || 40.03883
        ),
        ellipse: ellipseGraphics,
    });

    return entity;
}