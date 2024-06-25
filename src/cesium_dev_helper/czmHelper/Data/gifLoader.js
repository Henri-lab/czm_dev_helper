import SuperGif from 'libgif' //https://www.npmjs.com/package/libgif
import * as Cesium from 'cesium';

/**
 * Loads a GIF and creates a Cesium CallbackProperty for animating the GIF.
 *
 * @async
 * @function gifLoader
 * @param {string} url - The URL of the GIF to load.
 * @param {Array<string>} gifArr - The array to store the frames of the GIF as base64 URLs.
 * @param {number} slow - The speed factor for the GIF animation (higher values make the animation slower).
 * @param {string} _url - The second choice if failed.
 * @returns {Promise<Cesium.CallbackProperty|null>} imageProperty
 */
export default async function gifLoader(url, gifArr, slow, _url) {
    try {
        await parseGifImages(url, gifArr, slow)
    } catch (e) {
        console.error('Error loading GIF:', e);
        gifArr = [_url]; //加载gif 就加载_url
        return null;
    }
    const property = createImageCallback(url, gifArr, slow)
    return property;
}

/**
 * Loads gif images and stores them as base64 URLs in an array.
 *
 * @async
 * @function parseGifImages
 * @param {string} url - The URL of the GIF to load.
 * @param {Array<string>} gifArr - The array to store the frames of the GIF as base64 URLs.
 * @returns {Promise<Array<string>>} gifArr - The array of GIF frames as base64 URLs.
 * @throws Will throw an error if the GIF fails to load or parse.
 */
async function parseGifImages(url, gifArr) {
    let img = document.createElement('img');
    img.src = url;
    img.setAttribute('rel:animated_src', url); // SuperGif library requires img tag to have these attributes
    img.setAttribute('rel:auto_play', '0');
    document.body.appendChild(img);

    // SuperGif core class
    let rub = new SuperGif({
        gif: img/*HTML Element*/
    });

    try {
        await new Promise((resolve, reject) => {
            rub.load(() => {
                try {
                    for (let i = 1; i <= rub.get_length(); i++) {
                        rub.move_to(i); // Traverse gif instance's each frame
                        gifArr.push(rub.get_canvas().toDataURL());
                    }
                    resolve(gifArr);
                } catch (e) {
                    reject(e);
                } finally {
                    document.body.removeChild(img);
                }
            });
        });
    } catch (e) {
        console.error('parseGifImages failed:', e);
        document.body.removeChild(img);
        throw e;
    }
}

/**
 * Creates a Cesium CallbackProperty for animating the GIF.
 *
 * @function createImageCallback
 * @param {Array<string>} gifArr - The array of GIF frames as base64 URLs.
 * @param {number} [slow=1] - The speed factor for the GIF animation. Higher values make the animation slower.
 * @returns {Cesium.CallbackProperty} imageProperty - A Cesium CallbackProperty that can be used to animate the GIF.
 */
function createImageCallback(gifArr, slow = 1) {
    let _slow = 1;
    if (Number(slow) || (Number(slow) > 0)) _slow = Number(slow);
    let i = 0;
    return new Cesium.CallbackProperty(() => {
        if (gifArr.length > 0) {
            if (i < _slow * (gifArr.length - 1) && i < (gifArr.length - 1)) {
                i++;
            } else {
                i = 0;//循环
            }
            return gifArr[Math.floor(i / _slow)];
        }
    }, false);
}










// 在展示gif图片时，可以考虑以下优化方案：

// 减少gif帧数或分辨率：可以通过减少gif图片的帧数或降低分辨率来减少gif文件的大小，从而提高加载和展示的效率。
// 使用WebP格式：考虑将gif图片转换为WebP格式，WebP格式相比于gif格式具有更好的压缩率和质量，能够减小图片文件的大小。
// 延迟加载：如果页面中需要展示大量gif图片，可以考虑使用延迟加载的方式，即在用户滚动到相关区域时再加载gif图片，减少页面一次性加载大量图片的压力。
// 图片缓存：利用浏览器的缓存机制，对gif图片进行缓存，减少重复加载，提高展示效率。
// 使用CDN加速：将gif图片托管到CDN上，利用CDN的加速服务提高图片加载速度。
// 合并请求：将多个gif图片合并为一个文件请求，减少HTTP请求次数，提高加载效率。
// 懒加载：只有当gif图片进入可视区域时才加载，可以减少不必要的加载和渲染。
// 使用Web Workers：在加载和处理gif图片时可以考虑使用Web Workers来提高并行处理能力，避免阻塞主线程。

// 代码优化建议：

// 提前加载gif图片：在需要使用gif图片的时候提前加载，避免每次都重新解析gif图片。
// 减少不必要的DOM操作：避免在循环中频繁地操作DOM，可以在加载完gif图片后再将其添加到页面中。
// 避免重复解析gif图片：在解析完gif图片后，可以将解析结果缓存起来，避免重复解析。
// 性能监控：对gif图片的加载和展示进行性能监控，及时发现并解决性能问题。
// 优化加载策略：可以考虑使用图片懒加载等策略，根据实际情况优化图片的加载时机。
// 资源释放：在不需要使用