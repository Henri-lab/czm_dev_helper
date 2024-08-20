function setCanvasStyle(size = 100,canvasHTMLElement) {
    canvasHTMLElement.width = size;
    canvasHTMLElement.height = size;
    let ctx = canvasHTMLElement.getContext("2d");
    let radius = size / 4
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#ff2d51"
    ctx.fill();

    const style = new ol.style.Style({
        image: new ol.style.Icon({
            img: canvasHTMLElement,
            imgSize: [canvasHTMLElement.width, canvasHTMLElement.height]
        })
    })
    return style;
}