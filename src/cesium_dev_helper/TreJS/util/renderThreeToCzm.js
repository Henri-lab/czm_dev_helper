export default function renderThreeToCzm(renderer, scene_czm) {
    const ctx_3 = renderer.domElement.getContext('webgl');
    if (ctx_3) {
        scene_czm.context._glContext._gl = ctx_3;
        scene_czm.render();
    }
    requestAnimationFrame(renderThreeToCzm);
}