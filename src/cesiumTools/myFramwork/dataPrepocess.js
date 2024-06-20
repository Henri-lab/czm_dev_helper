// 白膜偏移纠正
// 更新3dtiles的模型矩阵
const update3dtilesMaxtrix = (tx, ty, tile) => {
	const center=tile.boundingSphere.center
	// 获取以当前模型为原点的垂直于当前地表的垂直坐标系
	const m = Cesium.Transforms.eastNorthUpToFixedFrame(center);
	// x,y,z三个方向上的偏移值
	const _tx = tx ? tx : 0;
	const _ty = ty ? ty : 0;
	const _tz = 0;
	const tempTranslation = new Cesium.Cartesian3(_tx, _ty, _tz);
	// 计算模型原点与偏移坐标的方向向量 offset是偏移之后的点，translation是方向向量
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
	// 通过方向向量，计算进行的模型矩阵 相当于gl-matrix中的	// mat4.translate()
	tile.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
};