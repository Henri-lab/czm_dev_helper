import { isHexColor } from './valid'

export function handleThemeStyle(theme) {
    if (!isHexColor(theme)) {
        throw new Error('Invalid color format');
    }
    document.documentElement.style.setProperty('--el-color-primary', theme)
    for (let i = 1; i <= 9; i++) {
        document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(theme, i / 10)}`);
    }
    for (let i = 1; i <= 9; i++) {
        document.documentElement.style.setProperty(`--el-color-primary-dark-${i}`, `${getDarkColor(theme, i / 10)}`);
    }
}

export function hexToRgb(str) {
    if (!isHexColor(str)) {
        throw new Error('Invalid color format');
    }
    str = str.replace('#', '');
    let hexs = str.match(/../g);
    for (let i = 0; i < 3; i++) {
        hexs[i] = parseInt(hexs[i], 16);
    }
    return hexs;
}

export function rgbToHex(r, g, b) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        throw new Error('Invalid RGB values');
    }
    let hexs = [r.toString(16), g.toString(16), b.toString(16)];
    for (let i = 0; i < 3; i++) {
        if (hexs[i].length == 1) {
            hexs[i] = `0${hexs[i]}`;
        }
    }
    return `#${hexs.join('')}`;
}

export function getLightColor(color, level) {
    let rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i]);
    }
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

export function getDarkColor(color, level) {
    let rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor(rgb[i] * (1 - level));
    }
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}