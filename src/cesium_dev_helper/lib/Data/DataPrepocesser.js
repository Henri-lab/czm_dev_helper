import * as Cesium from "cesium";
class DataPrepocesser {
	constructor() { }

	/**
	  * 获取指定名称的静态资源的URL数组
	  * @param {string[]} nameArray - 名称数组
	  * @returns {string[]} - 静态资源的URL数组
	  */
	static getImgUrls(nameArray) {
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
	 * Updates the model matrix of a 3D tiles model to perform translation, rotation, and scaling operations.
	 *
	 * @param {Object} tileSet - The 3D tiles model to be updated.
	 * @param {number} [tx=0] - The x-coordinate translation value.
	 * @param {number} [ty=0] - The y-coordinate translation value.
	 * @param {number} [tz=-65] - The z-coordinate translation value.
	 * @param {number} [rx=0] - The rotation angle around the x-axis in degrees.
	 * @param {number} [ry=0] - The rotation angle around the y-axis in degrees.
	 * @param {number} [rz=0] - The rotation angle around the z-axis in degrees.
	 * @param {number} [scale=1.3] - The scaling factor.
	 *
	 * @returns {undefined} This function does not return a value.
	 */
	// 修改3dtiles位置
	static update3DtilesMaxtrix(tileSet, { tx = 0, ty = 0, tz = 0, rx = 0, ry = 0, rz = 0, scale = 1.0 }) {

		const cartoDegree = this.getCenterDegreeFrom3dTiles(tileSet)

		const surface = Cesium.Cartesian3.fromDegrees(cartoDegree.longitude, cartoDegree.latitude, cartoDegree.height);
		const m = Cesium.Transforms.eastNorthUpToFixedFrame(surface);

		//平移
		const _tx = tx ? tx : 0;
		const _ty = ty ? ty : 0;
		const _tz = tz ? tz : 0;
		const tempTranslation = new Cesium.Cartesian3(_tx, _ty, _tz);
		const offset = Cesium.Matrix4.multiplyByPoint(m, tempTranslation, new Cesium.Cartesian3(0, 0, 0));
		const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
		tileSet.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

		//旋转及缩放
		if (rx) {
			const mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rx));
			const rotate = Cesium.Matrix4.fromRotationTranslation(mx);
			Cesium.Matrix4.multiply(m, rotate, m);
		}

		if (ry) {
			const my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(ry));
			const rotate = Cesium.Matrix4.fromRotationTranslation(my);
			Cesium.Matrix4.multiply(m, rotate, m);
		}

		if (rz) {
			const mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rz));
			const rotate = Cesium.Matrix4.fromRotationTranslation(mz);
			Cesium.Matrix4.multiply(m, rotate, m);
		}

		if (scale) {
			const _scale = Cesium.Matrix4.fromUniformScale(scale);
			Cesium.Matrix4.multiply(m, _scale, m);
		}

		tileSet._root.transform = m;
	}




	/**
	 * Corrects the offset of a white film on 3D tiles.
	 * Updates the model matrix of the 3D tiles.
	 * @param {number} tx - The x-coordinate offset.
	 * @param {number} ty - The y-coordinate offset.
	 * @param {Object} tile - The tile to be updated.
	 * @static
	 */

	static update2DMaxtrix = (tx, ty, tile) => {
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
	static xsysLoader = (xs, ys) => {
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
	static convertToGeoJSON(positions, type) {
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


	/**
		* Retrieves the center of a 3D Tiles tileset.
		*
		* @param {Object} tileset - The 3D Tiles tileset.
		* @returns {Object} - The center(degree) of the tileset.
		*/
	static getCenterDegreeFrom3dTiles(tileset) {

		// 要获取 3D Tiles 的中心坐标，推荐的做法是通过 root 节点的 boundingVolume 获取。
		// root 节点是 3D Tiles 集的根节点，它通常会包含 boundingVolume 属性。
		// --获取 boundingVolume
		const boundingVolume = tileset.root.boundingVolume;

		// 如果是 BoundingSphere
		if (boundingVolume.boundingVolume instanceof Cesium.BoundingSphere) {
			const center = boundingVolume.boundingVolume.center;
			const cartographic = Cesium.Cartographic.fromCartesian(center);
			const latitude = Cesium.Math.toDegrees(cartographic.latitude);
			const longitude = Cesium.Math.toDegrees(cartographic.longitude);
			const height = cartographic.height;

			return {//degree！
				longitude,
				latitude,
				height,
			}
			// console.log('BoundingSphere Center:');
			// console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Height: ${height}`);
		}
		// 如果是 OrientedBoundingBox
		else if (boundingVolume.boundingVolume instanceof Cesium.OrientedBoundingBox) {
			const center = boundingVolume.boundingVolume.center;
			const cartographic = Cesium.Cartographic.fromCartesian(center);
			const latitude = Cesium.Math.toDegrees(cartographic.latitude);
			const longitude = Cesium.Math.toDegrees(cartographic.longitude);
			const height = cartographic.height;

			// console.log('OrientedBoundingBox Center:');
			// console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Height: ${height}`);
			return {//degree！
				longitude,
				latitude,
				height,
			}
		}
	}

	/**
	 * Extracts the bounding rectangle from an array of Cartesian positions.
	 *
	 * @param {Array.<Cartesian3>} positions - The array of Cartesian positions.
	 * @returns {Rectangle} The bounding rectangle in longitude, latitude coordinates.
	 */
	// 从 positions 数组中提取边界值 west south east north
	static getRectangleFromPositions(positions) {
		// 与 Cesium.Rectangle.fromCartesianArray 功能基本一致
		let west = Number.POSITIVE_INFINITY;
		let south = Number.POSITIVE_INFINITY;
		let east = Number.NEGATIVE_INFINITY;
		let north = Number.NEGATIVE_INFINITY;

		positions.forEach(position => {
			const cartographic = Cesium.Cartographic.fromCartesian(position);
			const longitude = cartographic.longitude;
			const latitude = cartographic.latitude;

			west = Math.min(west, longitude);
			south = Math.min(south, latitude);
			east = Math.max(east, longitude);
			north = Math.max(north, latitude);
		});

		return new Cesium.Rectangle(west, south, east, north);
	}

	/**
	 * Extracts the bounding rectangle from a diagonal of Cartesian positions.
	 *
	 * @param {Array.<Cartesian3>} positions - The array of Cartesian positions. It must contain exactly 2 positions.
	 * @returns {Rectangle} The bounding rectangle in longitude, latitude coordinates.
	 * @throws {Error} If the positions array does not contain exactly 2 positions.
	 */
	static getRectangleFromDiagonal(positions) {
		if (positions.length !== 2) {
			throw new Error("The positions array must contain exactly 2 positions.");
		}

		const southwest = Cesium.Cartographic.fromCartesian(positions[0]);
		const northeast = Cesium.Cartographic.fromCartesian(positions[1]);

		return new Cesium.Rectangle(
			southwest.longitude,
			southwest.latitude,
			northeast.longitude,
			northeast.latitude
		);
	}

	// markCluster(entities) {
	// 	if (!entities || entities.length === 0) {
	// 		return [];
	// 	}
	// 	const k = determineOptimalClusters(entities); // 假设有一个函数可以确定最佳聚类数量
	// 	const clusters = kMeansCluster(entities, k);
	// 	return clusters;
	// }


	static getCenterOfPrimitives(primitives) {
    // 检查 primitives 是否为空
    if (primitives.length === 0) {
        throw new Error('Primitives array is empty');
    }

    // 初始化 boundingSphere 为第一个 primitive 的包围球
    let boundingSphere = Cesium.BoundingSphere.fromPoints([primitives[0].position]);

    // 遍历其余的 primitives 并扩展 boundingSphere
    for (let i = 1; i < primitives.length; i++) {
        const primitive = primitives[i];
        Cesium.BoundingSphere.expand(boundingSphere, Cesium.BoundingSphere.fromPoints([primitive.position]));
    }
    
    return boundingSphere.center;
}





}






export default DataPrepocesser


