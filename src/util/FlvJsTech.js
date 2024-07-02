import videojs from 'video.js';
import flvjs from 'flv.js';

// Get the default Html5 tech from Video.js
const Html5 = videojs.getTech('Html5');

export class FlvJsTech extends Html5 {
    constructor(options, ready) {
        super(options, ready);
        this.flvPlayer = null; // Initialize the flv.js player instance
        this._options = options;
        this._el = this.el(); // Use the existing element from Video.js
    }

    /**
     * Set the source for the FLV player.
     * @param {string} src - The URL of the FLV stream.
     */
    setSrc(src) {
        // Detach and destroy any existing flv.js player instance
        if (this.flvPlayer) {
            this.flvPlayer.detachMediaElement();
            this.flvPlayer.destroy();
        }

        // Create a new flv.js player instance with the provided source
        this.flvPlayer = flvjs.createPlayer({ url: src, type: 'flv' }, this._options);
        this.flvPlayer.attachMediaElement(this._el);
        this.flvPlayer.load();
    }

    /**
     * Dispose of the FLV player and clean up resources.
     */
    dispose() {
        if (this.flvPlayer) {
            this.flvPlayer.detachMediaElement();
            this.flvPlayer.destroy();
        }
        super.dispose(); // Call the parent class dispose method
    }

    // Define the supported formats
    static formats = {
        'video/flv': 'FLV',
        'video/x-flv': 'FLV'
    };

    /**
     * Check if flv.js is supported in the current environment.
     * @returns {boolean} - True if supported, false otherwise.
     */
    static isSupported() {
        return flvjs.isSupported();
        // flv.js 库用来检测当前浏览器环境是否支持播放 FLV 格式视频的关键方法。这个方法返回一个布尔值，表示 flv.js 是否可以在当前环境中正常工作。
        //模拟实现：（MSE 是现代浏览器中用来处理流媒体的 API）
        //     class FlvJs {
        //         static isSupported() {
        //             if (window.MediaSource && typeof window.MediaSource.isTypeSupported === 'function') {
        //                 // Check if browser supports MSE and required codecs
        //                 return window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
        //             }
        //             return false;
        //         }
        //     }
        // }
    }
    /**
     * Check if the tech can play a given type.
     * @param {string} type - The MIME type of the video.
     * @returns {string} - 'maybe' if the tech can play the type, '' otherwise.
     */
    static canPlayType(type) {
        return FlvJsTech.isSupported() && type in FlvJsTech.formats ? 'maybe' : '';
    }

    /**
     * Check if the tech can play a given source.
     * @param {Object} source - The video source object.
     * @returns {string} - 'maybe' if the tech can play the source, '' otherwise.
     */
    static canPlaySource(source) {
        return FlvJsTech.isSupported() && source.src.endsWith('.flv') ? 'maybe' : '';
    }
}

// Register the tech with Video.js
videojs.registerTech('FlvJsTech', FlvJsTech);

