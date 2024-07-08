// 使用 fetch 实现进度反馈的通用加载函数
/**
 * Fetch data with progress feedback.
 * @async
 * @param {string} url - The URL to fetch.
 * @param {Object} options - Additional options including progress callbacks.
 * @returns {Promise<Response>} The fetch response.
 */
export async function fetchWithProgress(url, options) {
    const response = await fetch(url, {
        method: 'GET',
        headers: options.headers || {}
    });

    const reader = response.body.getReader();

    // 获取响应体的总长度
    const contentLength = +response.headers.get('Content-Length');
    // 初始化接收的长度和存储块的数组
    let receivedLength = 0;
    const chunks = [];

    // 持续读取响应体的块数据
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 将读取到的块数据推入数组，并更新已接收的长度
        chunks.push(value);
        receivedLength += value.length;

        if (options.onProgress) {
            // 传递百分比到回调
            const percentComplete = (receivedLength / contentLength) * 100;
            options.onProgress(percentComplete);
        }
    }

    // 创建一个新的 Uint8Array 来存储所有的块数据
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    // 将所有块数据合并到一个单一的 Uint8Array 中
    for (let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
    }


    // 直接解析为json格式并导出
    // const jsonData = JSON.parse(new TextDecoder().decode(chunksAll));
    // return jsonData; 

    // 导出原始数据 可以在外部解析为json
    return new Response(chunksAll, { headers: response.headers });
}



// 这种方法适用于小型 3D Tiles 文件，因为文件会在客户端内存中加载。
// 大型 3D Tiles 文件可能需要更复杂的处理，包括分块加载和内存管理。
// 由于浏览器的安全限制，某些高级功能可能无法通过 Blob URL 实现。
export function load(elID, viewer) {
    let fileInput = document.getElementById(elID || 'fileInput');
    let file = fileInput.files[0];

    if (file) {
        // Read the file as a Blob URL
        // Blob URL 是一种临时的、本地的 URL，它允许你通过 JavaScript 访问内存中的文件或数据。
        // 它们是由 URL.createObjectURL 方法生成的，指向一个 Blob 或 File 对象。
        // Blob URL 可以像普通的 URL 一样使用，
        // 例如在 src 属性中设置图片、视频、音频文件，或者在 href 属性中创建可下载的链接。
        let fileURL = URL.createObjectURL(file);

        var tileset = new Cesium.Cesium3DTileset({
            url: fileURL
        });

        // Add the tileset to the viewer
        viewer.scene.primitives.add(tileset);

        // Release the Blob URL after loading
        // 在使用 URL.createObjectURL 创建一个 Blob URL 后，
        // 该 URL 会一直存在，直到手动释放它。为了防止内存泄漏
        tileset.readyPromise.then(function (tiles) {
            viewer.zoomTo(tiles)
            URL.revokeObjectURL(fileURL);
        }).otherwise(function (error) {
            console.error('Error loading 3D Tileset:', error);
        });
    }
}
