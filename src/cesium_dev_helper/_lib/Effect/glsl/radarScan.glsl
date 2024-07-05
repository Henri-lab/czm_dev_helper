// 对输入的颜色纹理和深度纹理进行扫描效果的渲染。
// 根据传入的扫描中心、扫描平面法线、扫描线法线、扫描半径和扫描颜色，计算出扫描效果并将其应用到输出颜色上。


// 外部传入的颜色纹理和深度纹理
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;

// 顶点着色器传递的纹理坐标
in vec2 v_textureCoordinates;

// 外部传入的扫描中心和平面法线，扫描线的法线，扫描半径，扫描颜色
uniform vec4 u_scanCenterEC;
uniform vec3 u_scanPlaneNormalEC;
uniform vec3 u_scanLineNormalEC;
uniform float u_radius;
uniform vec4 u_scanColor;

// 在顶点着色器中输出的颜色
out vec4 myOutputColor;

// 将屏幕空间坐标转换为视角空间坐标的函数
vec4 toEye(in vec2 uv, in float depth) {
    vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));
    vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);
    posInCamera = posInCamera / posInCamera.w;
    return posInCamera;
}

// 判断点是否在指定直线的右侧的函数
bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt) {
    vec3 v01 = testPt - ptOnLine;
    normalize(v01);
    vec3 temp = cross(v01, lineNormal);
    float d = dot(temp, u_scanPlaneNormalEC);
    return d > 0.5;
}

// 计算点在平面上的投影点的函数
vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point) {
    vec3 v01 = point - planeOrigin;
    float d = dot(planeNormal, v01);
    return (point - planeNormal * d);
}

// 获取深度值的函数
float getDepth(in vec4 depth) {
    float z_window = czm_unpackDepth(depth); // 解包深度值
    z_window = czm_reverseLogDepth(z_window); // 反向对数深度变换
    float n_range = czm_depthRange.near; // 近平面深度范围
    float f_range = czm_depthRange.far; // 远平面深度范围
    return (2.0 * z_window - n_range - f_range) / (f_range - n_range); // 计算真实深度值
}

void main() {
    // 获取颜色纹理中的颜色值
    myOutputColor = texture(colorTexture, v_textureCoordinates);

    // 获取深度纹理中的深度值
    float depth = getDepth(texture(depthTexture, v_textureCoordinates));

    // 将当前像素的纹理坐标和深度值转换为视角空间坐标
    vec4 viewPos = toEye(v_textureCoordinates, depth);

    // 计算点在扫描平面上的投影点
    vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);

    // 计算当前像素点到扫描中心的距离
    float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);

    // 计算扫描半径的两倍
    float twou_radius = u_radius * 2.0;

    // 如果当前像素在扫描范围内
    if(dis < u_radius) {
        // 计算距离扫描中心的偏移量，并应用指数函数进行平滑过渡
        float f0 = 1.0 - abs(u_radius - dis) / u_radius;
        f0 = pow(f0, 64.0);

        // 计算扫描线的端点位置
        vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;

        float f = 0.0;
        // 如果当前像素在扫描线的右侧
        if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz)) {
            // 计算当前像素到扫描线端点的距离
            float dis1 = length(prjOnPlane.xyz - lineEndPt);
            // 计算当前像素点距离扫描线的偏移量，并应用指数函数进行平滑过渡
            f = abs(twou_radius - dis1) / twou_radius;
            f = pow(f, float(WIDTH)); // 使用外部传入的宽度参数控制过渡的强度
        }

        // 如果外部传入的边界参数大于0
        if(float(BORDER) > 0.0) {
            // 将当前像素的颜色与扫描颜色进行混合，并应用外部传入的偏移量参数
            myOutputColor = mix(myOutputColor, u_scanColor, f + f0);
        } else {
            // 否则，只应用外部传入的偏移量参数
            myOutputColor = mix(myOutputColor, u_scanColor, f);
        }
    }
}
