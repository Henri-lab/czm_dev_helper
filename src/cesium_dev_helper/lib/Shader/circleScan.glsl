
// 这个着色器的目的是在一个平面上实现扫描效果，
// 扫描平面的中心和法向量由u_scanCenterEC和u_scanPlaneNormalEC定义，
// 扫描平面的半径由u_radius控制，
// 扫描效果的颜色由u_scanColor定义。
// {BORDER} 用于控制扫描效果的边界强度。

uniform sampler2D colorTexture;//颜色纹理，用于获取片段的颜色信息
uniform sampler2D depthTexture;//深度纹理，用于获取片段的深度信息。
uniform vec4 u_scanCenterEC;//扫描平面的中心点（在眼坐标系中）
uniform vec3 u_scanPlaneNormalEC;//扫描平面的法向量（在眼坐标系中）。
uniform float u_radius;//扫描平面的半径。
uniform vec4 u_scanColor;//扫描效果的颜色。
//BORDER--用于控制边界效果的一个整数 宏常量。

in vec2 v_textureCoordinates;//片段的纹理坐标。
out vec4 myOutputColor;//最终输出的片段颜色。

// 将纹理坐标和深度值转换为眼坐标系中的位置。
vec4 toEye(in vec2 uv, in float depth) {
    vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));
    vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);
    posInCamera = posInCamera / posInCamera.w;
    return posInCamera;
}

// 计算一个点在平面上的投影。
vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point) {
    vec3 v01 = point - planeOrigin;
    float d = dot(planeNormal, v01);
    return (point - planeNormal * d);
}

//从深度纹理中提取线性深度值。
float getDepth(in vec4 depth) {
    float z_window = czm_unpackDepth(depth);
    z_window = czm_reverseLogDepth(z_window);
    float n_range = czm_depthRange.near;
    float f_range = czm_depthRange.far;
    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
}

void main() {
    myOutputColor = texture(colorTexture, v_textureCoordinates);
    float depth = getDepth(texture(depthTexture, v_textureCoordinates));//从深度纹理中获取当前片段的深度值
    vec4 viewPos = toEye(v_textureCoordinates, depth);//将当前片段从屏幕空间转换到眼坐标系
    // 计算当前片段在扫描平面上的投影位置
    vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);
    // 计算当前片段到扫描平面中心的距离。
    float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);
    if(dis < u_radius) {
        // 根据片段与扫描平面中心的距离计算混合因子，用于控制扫描效果的强度。
        float f = 1.0 - abs(u_radius - dis) / u_radius;
        f = pow(f, float({BORDER}));
        myOutputColor = mix(myOutputColor, u_scanColor, f);
    }
}


