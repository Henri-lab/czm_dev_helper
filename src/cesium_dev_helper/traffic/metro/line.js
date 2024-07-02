import * as Cesium from "cesium";
// metroLine：name ;color ; positions

// 缓存line
let lines = [];
export const renderLines = (viewer, options) => {
    // 将line的地理坐标转为Cartesian
    const positions = Cesium.defaultValue(options.positions, [
        {
            lng: 0,
            lat: 0,
        },
    ]);
    const _pointsOfLine = [];
    positions.forEach(pos => {
        _pointsOfLine.push(pos.lng, pos.lat);
    });
    const cartesianOfLine = Cesium.Cartesian3.fromDegreesArray(_pointsOfLine);
    // 加入到viewer中
    const lineEnt = viewer.entities.add({
        name,
        polyline: {
            positions: cartesianOfLine,
            width: 20,
            //使用cesium默认的泛光线
            material: new Cesium.PolylineGlowMaterialProperty({
                color: new Cesium.Color.fromCssColorString(color),
                glowPower: 0.12,
            }),
        },
    });

    const color = Cesium.defaultValue(options.color, '#e9a526');
    const name = Cesium.defaultValue(options.name, "line");
    // 是否缓存
    const isCache = Cesium.defaultValue(options.isCache, true);
    isCache && lines.push(lineEnt);

    return lineEnt;
};


// 删除地铁线路，不是隐藏
export const removeAllLines = (viewer) => {
    lines.forEach(line => {
        line && viewer.entities.remove(line);
    });
};


// 根据线路名称闪烁线路
let timerBink;/*定时器*/
let lastActiveRoute;/*最近高亮*/
export const binkLineByName = (name /*selected*/, binkCount = 6 /*闪烁次数*/, timeBreak = 600 /*闪烁周期*/) => {
    const targetEnt = lines.find(item => item.name === name);
    if (!targetEnt) {
        return;
    }
    // 如果选中的是刚刚高亮的，判断是否存在定时器，存在的话，就返回
    if (timerBink && name === lastActiveRoute) {
        return;
    }

    // 如果选中的不是刚刚高亮的，直接清除定时器，然后高亮
    if (name !== lastActiveRoute && timerBink) {
        window.clearInterval(timerBink);
        timerBink = null;
        lastActiveEnt.polyline.material.glowPower = 0.12;
    }

    const originGlowPower = targetEnt.polyline.material.glowPower;

    let count = 0;/*闪烁辅助*/

    timerBink = setInterval(() => {
        if (count >= binkCount) {
            window.clearInterval(timerBink);
            timerBink = null;
        } else {
            // 闪烁
            let isBink = count % 2 === 0;
            targetEnt.polyline.material.glowPower = isBink
                ? originGlowPower * 4
                : originGlowPower;
            count++;
        }
    }, timeBreak);
};

// 跳转
// --根据名称视角跳转到对应线路
export const flyToLine = (viewer, name) => {
    const targetEnt = lines.find(item => item.name === name);
    if (!targetEnt) {
        return;
    }
    viewer.flyTo(targetEnt);
};

// --通过站线名称跳转到站线质心点
export const flyToLineCenter = (viewer, lineName, linesData) => {
    let lineEnt
    let dataSource = linesData ? linesData : lines
    lineEnt = dataSource.find(item => item.name === lineName)
    viewer.flyTo(lineEnt, {
        offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40), Cesium.Math.toRadians(-40), 20000)
    })
}


// 通过名称标记line的显隐
export const displayLineByName = (names, isShow) => {
    lines.forEach(line => {
        if (names.indexOf(line.name) > -1) {
            line.show = isShow;
        }
    });
};
