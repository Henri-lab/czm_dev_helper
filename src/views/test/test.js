const test_loadtiles = () => {
  console.log('test');
  const p = new Cesium3DTileset({
    url: '/src/mock/3dtiles/Tile_+000_+000/tileset.json',
  });
  console.log($viewer.scene)
  p.readyPromise.then((tileset) => {
    $viewer.scene.primitives.add(tileset);
    $viewer.zoomTo(tileset);
  });
};