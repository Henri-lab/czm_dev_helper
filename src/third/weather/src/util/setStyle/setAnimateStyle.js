function setAnimateStyle({
    map,
    size = 40,
    canvasHTMLElement
}) {
    canvasHTMLElement.width = size;
    canvasHTMLElement.height = size;
    let ctx = canvasHTMLElement.getContext("2d");
    let increase = true;
    let radius = size / 4  //10
    // 10~14
    // <10 true ++;
    // >14 false --
    function frame() {
        ctx.clearRect(0, 0, canvasHTMLElement.width, canvasHTMLElement.height); //清空画布
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "#ff2d5180"
        ctx.fill();
        /* 累加蓝色的圆 */
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 4 - 1, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "#1793FD"
        ctx.fill();

        if (radius < size / 4) {
            increase = true;
        } else if (radius > (size / 4 + 4)) {
            increase = false;
        }
        if (increase) {
            radius++;
        } else {
            radius--;
        }
        setTimeout(frame, 150)
        map.render(); //ol
    }
    frame();

    const style = new ol.style.Style({
        image: new ol.style.Icon({
            img: canvasHTMLElement,
            imgSize: [canvasHTMLElement.width, canvasHTMLElement.height]
        })
    })
    return style;
}