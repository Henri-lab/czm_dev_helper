import { marked } from 'marked';
import Prism from 'prismjs';
import DOMPurify from 'dompurify';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
const codeString =
    `
<template>
    <div class="ex1" style="display: flex;flex-direction: column;">
        <CzmMap name='threeSync123' :option="opt" width="800px" height="1000px">
            <CzmCtx></CzmCtx>
            <Three :children="threeObjs"></Three>
        </CzmMap>
    </div>
</template>

<script setup>
import { CzmCtx, CzmMap, Three } from '../../components'
import * as THREE from 'three'
import { onMounted } from 'vue';
const opt = {
    extraConfig: {
        name: 'threeSync123',
        AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDk4NmM5OS03MmNlLTRiNWItOTUzNy1hYzhkMTUwYjgwNmQiLCJpZCI6MjE3MTc3LCJpYXQiOjE3MTcwNTUwMTh9.C3dvJjK0cBUhb87AI_EnpLPUwxD3ORI8sGcntlhCAmw',
        logo: false,
        depthTest: true,
    },
    baseConfig: {
        contextOptions: {
            requestWebgl2: true,
            webgl: {
                antialias: true,
                preserveDrawingBuffer: true,
                stencil: true,
                logarithmicDepthBuffer: true,
                alpha: true,
            }
        },
        useDefaultRenderLoop: false,
        selectionIndicator: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animate: false,
        timeline: false,
        fullscreenButton: false,
        navigationInstructionsInitiallyVisible: false,
        allowTextureFilterAnisotropic: false,
        targetFrameRate: 60,
        resolutionScale: 0.1,
        orderIndependentTranslucency: true,
        baseLayerPicker: true,
        geocoder: false,
        automaticallyTrackDataSourceClocks: false,
        dataSources: null,
        clock: null,
        terrainShadows: Cesium.ShadowMode.DISABLED
    },
}
const threeObjs = []
function initMeshes(arr) {
    // 环形 extrude
    const closedSpline = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-60, 30, 60), // 左下
        new THREE.Vector3(-60, 100, 60), // 左中
        new THREE.Vector3(-60, 220, 60), // 左上
        new THREE.Vector3(60, 80, -60), // 右中
        new THREE.Vector3(60, 30, -60), // 右下
    ]);
    // 2、extrude settings
    closedSpline.curveType = "catmullrom";
    closedSpline.closed = true;
    const extrudeSettings = {
        steps: 100,
        bevelEnabled: false,
        extrudePath: closedSpline,
    };
    // 3、construct shape
    const r = 20; // 截面半径
    const pts1 = [];
    const count = 3; // 截面的棱边数量
    for (let index = 0; index < count; index++) {
        // index/count 几分之几，2π为周长
        const a = (index / count) * Math.PI * 2;
        pts1.push(new THREE.Vector2(r * Math.cos(a), r * Math.sin(a)));
    }
    const shape1 = new THREE.Shape(pts1);
    // create geometry
    const geometry1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings);
    // create material
    const material1 = new THREE.MeshLambertMaterial({
        color: 0xb00000,
    });
    // assembly meshes
    const mesh1 = new THREE.Mesh(geometry1, material1);
    // push mesh to arr
    arr.push(mesh1);

    // 第二个物体
    // path
    const randomPoints = [];
    for (let index = 0; index < 10; index++) {
        randomPoints.push(
            new THREE.Vector3((index - 4.5) * 80, THREE.MathUtils.randFloat(100, 150), THREE.MathUtils.randFloat(-50, 50))
        );
    }
    const randomSpline = new THREE.CatmullRomCurve3(randomPoints);
    const extrudeSettings2 = {
        steps: 200,
        bevelEnabled: false,
        extrudePath: randomSpline,
    };
    // shape
    const pts2 = [],
        numPts = 5;
    // 五角星是五个角十条边
    for (let i = 0; i < numPts * 2; i++) {
        // 计算radius 半径，基数为10反正20（就是内外圆计算）
        const r = i % 2 == 1 ? 10 : 20;
        // 角度
        const a = (i / numPts) * Math.PI;
        pts2.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
    }
    const shape2 = new THREE.Shape(pts2);
    const geometry2 = new THREE.ExtrudeGeometry(shape2, extrudeSettings2);
    const material2 = new THREE.MeshLambertMaterial({ color: 0xff8000 });
    const mesh2 = new THREE.Mesh(geometry2, material2);
    arr.push(mesh2);

    // 第三个物体
    const material3 = [material1, material2];
    const extrudeSettings3 = {
        depth: 20,
        steps: 1,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 4,
        bevelSegments: 1,
    };
    const geometry3 = new THREE.ExtrudeGeometry(shape2, extrudeSettings3);
    const mesh3 = new THREE.Mesh(geometry3, material3);
    mesh3.position.set(50, 220, 50);
    arr.push(mesh3);
}
function initLight(arr) {
    arr.push(new THREE.AmbientLight(0xffffff, 0.2));
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888);
    hemiLight.position.set(0, 1, 0);
    arr.push(hemiLight);
}
onMounted(()=>{
    initMeshes(threeObjs)
    initLight(threeObjs)
})
</script>
`

// 创建一个自定义渲染器
const renderer = new marked.Renderer();

// 重写代码块的渲染方法
renderer.code = function (code, language) {
    // 如果语言是 'html'，将其替换为 'markup'
    let prismLanguage = language === 'html' ? 'markup' : language;
    // if (!Prism.languages[prismLanguage]) {
    //     try {
    //         require(`prismjs/components/prism-${prismLanguage}`);
    //     } catch (e) {
    //         console.warn(`未找到 Prism.js 对应的语言组件：${prismLanguage}，将使用纯文本显示。`);
    //         prismLanguage = 'plaintext';
    //     }
    // }
    // 高亮代码
    const highlighted = Prism.highlight(code, Prism.languages[prismLanguage] || Prism.languages.javascript, prismLanguage);

    // 创建一个容器，包含预览和代码展示
    return `
    <div class="code-demo">
      <div class="preview">
        ${executeCode(code)}
      </div>
      <pre class="code-block"><code class="language-${language}">${highlighted}</code></pre>
      <button class="toggle-code">显示/隐藏代码</button>
    </div>
  `;
};
function executeCode(code) {
    // 使用 DOMPurify 清理代码，防止 XSS 攻击
    const cleanCode = DOMPurify.sanitize(code);

    // 创建一个包含代码的 <script> 标签
    // 这里假设代码是 HTML 或者可以在浏览器中执行的 JavaScript
    return `<div class="code-output">${cleanCode}</div>`;
}
// 设置 marked 的渲染器
marked.setOptions({
    renderer: renderer,
    // 开启 HTML 支持
    gfm: true,
    breaks: true,
    smartypants: true,
});



// 示例 Markdown 内容
const markdownContent = `
这是一个示例：

\`\`\`html
<div style="color: red;">这是红色的文字。</div>
\`\`\`

更多内容...
`;

// 将 Markdown 转换为 HTML
const htmlContent = marked(markdownContent);
export default exampleCode = (dom) => {
    dom.innerHTML = htmlContent
    document.addEventListener('click', function (event) {
        if (event.target.matches('.toggle-code')) {
            const codeBlock = event.target.previousElementSibling;
            if (codeBlock.style.display === 'none') {
                codeBlock.style.display = 'block';
            } else {
                codeBlock.style.display = 'none';
            }
        }
    });
}
