import * as Cesium from "cesium";
class DataPrepocesser {
	constructor() { }

	/**
	  * 获取指定名称的静态资源的URL数组
	  * @param {string[]} nameArray - 名称数组
	  * @returns {string[]} - 静态资源的URL数组
	  */
	getImgUrls(nameArray) {
		let imgUrls = [];
		nameArray.forEach(name => {
			// If the dfSt object exists and contains the specified name,
			// push the corresponding URL to the imgUrls array.
			if (this.dfSt && this.dfSt[name]) {
				imgUrls.push(this.dfSt[name]);
			} else {
				// If the dfSt object does not exist or does not contain the specified name,
				// push the default image URL to the imgUrls array.
				imgUrls.push(this.defaultImageUrl);
			}
		});
		// Return the array of URLs.
		return imgUrls;
	}


	/**
	 * Corrects the offset of a white film on 3D tiles.
	 * Updates the model matrix of the 3D tiles.
	 * @param {number} tx - The x-coordinate offset.
	 * @param {number} ty - The y-coordinate offset.
	 * @param {Object} tile - The 3D tile to be updated.
	 * @static
	 */
	
	update3dtilesMaxtrix = (tx, ty, tile) => {
		const center = tile.boundingSphere.center
		// Get the vertical coordinate system based on the current model as the origin
		const m = Cesium.Transforms.eastNorthUpToFixedFrame(center);
		// Offset values in the x, y, and z directions
		const _tx = tx ? tx : 0;
		const _ty = ty ? ty : 0;
		const _tz = 0;
		const tempTranslation = new Cesium.Cartesian3(_tx, _ty, _tz);
		// Calculate the direction vector from the model origin to the offset coordinates
		// offset is the point after offset, and translation is the direction vector
		const offset = Cesium.Matrix4.multiplyByPoint(
			m,
			tempTranslation,
			new Cesium.Cartesian3(0, 0, 0)
		);
		const translation = Cesium.Cartesian3.subtract(
			offset,
			center,
			new Cesium.Cartesian3()
		);
		// Calculate the model matrix performed by the direction vector
		// Equivalent to gl-matrix's mat4.translate()
		tile.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
	};


	/**
	 * Converts string xs, ys data into an array of coordinates.
	 * @function xsysLoader
	 * @param {string} xs - A string of comma-separated x-coordinates.
	 * @param {string} ys - A string of comma-separated y-coordinates.
	 * @returns {Array<number>} An array of coordinates [x1, y1, x2, y2, ...].
	 * @throws Will throw an error if the lengths of xs and ys are not equal.
	 */
	xsysLoader = (xs, ys) => {
		let posArr = [];
		if (typeof xs === 'string' && typeof ys === 'string') {
			const xArr = xs.split(',').map(parseFloat);
			const yArr = ys.split(',').map(parseFloat);
			if (xArr.length === yArr.length) {
				for (let i = 0; i < xArr.length; i++) {
					posArr.push(xArr[i], yArr[i]);
				}
			} else {
				throw new Error('The lengths of xs and ys are not equal.');
			}
		} else {
			throw new Error('xs and ys must be strings.');
		}
		return posArr;
	}

	/**
	 * Convert Cesium Cartesian3 coordinates to GeoJSON format.
	 * @param {Array} positions - Array of Cesium.Cartesian3 positions.
	 * @param {String} type - Type of GeoJSON feature ('Point', 'LineString', 'Polygon').
	 * @returns {Object} GeoJSON feature object.
	 */
	convertToGeoJSON(positions, type) {
		let coordinates;

		switch (type) {
			case 'Point':
				if (positions.length !== 1) {
					throw new Error('Point type requires exactly one position.');
				}
				const cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
				coordinates = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
				break;

			case 'LineString':
				coordinates = positions.map(position => {
					const cartographic = Cesium.Cartographic.fromCartesian(position);
					return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
				});
				break;

			case 'Polygon':
				if (positions.length < 3) {
					throw new Error('Polygon type requires at least three positions.');
				}
				coordinates = [positions.map(position => {
					const cartographic = Cesium.Cartographic.fromCartesian(position);
					return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
				})];
				break;

			default:
				throw new Error(`Unsupported GeoJSON type: ${type}`);
		}

		return {
			type: 'Feature',
			geometry: {
				type: type,
				coordinates: coordinates
			},
			properties: {}
		};
	}

	

	





}






export default DataPrepocesser


