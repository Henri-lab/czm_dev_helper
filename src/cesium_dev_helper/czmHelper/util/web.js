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
