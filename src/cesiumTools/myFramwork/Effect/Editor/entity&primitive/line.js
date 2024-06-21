// metroLine

let lines = [];
export const renderLines = (viewer, options) => {
    const positions = Cesium.defaultValue(options.positions, [
        {
            lng: 0,
            lat: 0,
        },
    ]);
    const positionsR = [];
    positions.forEach((path) => {
        positionsR.push(path.lng, path.lat);
    });
    const color = Cesium.defaultValue(options.color, '#e9a526');
    const name = Cesium.defaultValue(options.name, "line");
    // 是否缓存
    const isCache = Cesium.defaultValue(options.isCache, true);

    const positionRes = Cesium.Cartesian3.fromDegreesArray(positionsR);
    const lineEnt = viewer.entities.add({
        name,
        polyline: {
            positions: positionRes,
            width: 20,
            //使用cesium默认的泛光线
            material: new Cesium.PolylineGlowMaterialProperty({
                color: new Cesium.Color.fromCssColorString(color),
                glowPower: 0.12,
            }),
        },
    });
    isCache && lines.push(lineEnt);

    return lineEnt;
};


// 删除地铁线路，不是隐藏
export const removeAllLines = (viewer) => {
    lines.forEach((line) => {
        line && viewer.entities.remove(line);
    });
};


// 根据线路名称闪烁线路
let timerBink;/*定时器*/
let lastActiveRoute;/*最近高亮*/
export const binkLineByName = (name /*selected*/, binkCount = 6 /*闪烁次数*/, timeBreak = 600 /*闪烁周期*/) => {
    const targetEnt = lines.find((item) => item.name === name);
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


// 根据名称视角跳转到对应线路
export const flyToLine = (viewer, name) => {
    const targetEnt = lines.find((item) => item.name === name);
    if (!targetEnt) {
        return;
    }
    viewer.flyTo(targetEnt);
};

// 通过名称控制线路显示隐藏
export const hideLineByName = (names, isShow) => {
    lines.forEach((line) => {
        if (names.indexOf(line.name) > -1) {
            line.show = isShow;
        }
    });
};
