/**
 * @class DomUtil
 * @classdesc Utility class for DOM manipulations.
 */
export default class Dom {
    /**
     * Creates a DOM element.
     * @param {string} tagName - The tag name of the element to create.
     * @param {string} [className] - Optional class name to assign to the element.
     * @param {HTMLElement} [container] - Optional container to append the created element to.
     * @returns {HTMLElement} The created DOM element.
     */
    createDom(tagName, className = "", container) {
        const el = document.createElement(tagName);
        el.className = className;
        if (container) {
            container.appendChild(el);
        }
        return el;
    }

    /**
     * Removes a DOM element.
     * @param {HTMLElement} el - The element to remove.
     */
    removeDom(el) {
        const parent = el.parentNode;
        if (parent) {
            parent.removeChild(el);
        }
    }

    /**
     * Empties a DOM element.
     * @param {HTMLElement} el - The element to empty.
     */
    emptyDom(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }

    /**
     * Adds a class to a DOM element.
     * @param {HTMLElement} el - The element to add the class to.
     * @param {string} name - The class name to add.
     */
    addDomClass(el, name) {
        if (el.classList) {
            const classes = this.splitWords(name);
            for (const cls of classes) {
                el.classList.add(cls);
            }
        } else if (!this.hasClass(el, name)) {
            const className = this.getDomClass(el);
            this.setDomClass(el, `${className ? className + " " : ""}${name}`);
        }
    }

    /**
     * Removes a class from a DOM element.
     * @param {HTMLElement} el - The element to remove the class from.
     * @param {string} name - The class name to remove.
     */
    removeDomClass(el, name) {
        if (el.classList) {
            el.classList.remove(name);
        } else {
            this.setDomClass(el, this.trim(` ${this.getDomClass(el)} `.replace(` ${name} `, " ")));
        }
    }

    /**
     * Sets the class of a DOM element.
     * @param {HTMLElement} el - The element to set the class for.
     * @param {string} name - The class name to set.
     */
    setDomClass(el, name) {
        if (el.className.baseVal === undefined) {
            el.className = name;
        } else {
            el.className.baseVal = name;
        }
    }

    /**
     * Gets the class of a DOM element.
     * @param {HTMLElement} el - The element to get the class for.
     * @returns {string} The class name of the element.
     */
    getDomClass(el) {
        if (el.correspondingElement) {
            el = el.correspondingElement;
        }
        return el.className.baseVal === undefined ? el.className : el.className.baseVal;
    }

    /**
     * Creates an SVG element.
     * @param {number} width - The width of the SVG.
     * @param {number} height - The height of the SVG.
     * @param {string} path - The path data for the SVG.
     * @param {HTMLElement} [container] - Optional container to append the created SVG to.
     * @returns {SVGSVGElement} The created SVG element.
     */
    createDomSvg(width, height, path, container) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "svg-path");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEl.setAttribute("d", path);
        svg.appendChild(pathEl);
        if (container) {
            container.appendChild(svg);
        }
        return svg;
    }

    /**
     * Generates a UUID.
     * @param {string} [prefix="D"] - Optional prefix for the UUID.
     * @returns {string} The generated UUID.
     */
    createUUID(prefix = "D") {
        const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        let uuid = [];
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
        uuid[14] = "4";
        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                const r = 0 | (Math.random() * 16);
                uuid[i] = CHARS[i === 19 ? (r & 0x3) | 0x8 : r];
            }
        }
        return `${prefix}-${uuid.join("")}`;
    }

    // Helper methods
    /**
     * Splits a string into an array of words.
     * @param {string} str - The string to split.
     * @returns {string[]} The array of words.
     */
    splitWords(str) {
        return str.trim().split(/\s+/);
    }

    /**
     * Checks if an element has a class.
     * @param {HTMLElement} el - The element to check.
     * @param {string} name - The class name to check for.
     * @returns {boolean} True if the element has the class, otherwise false.
     */
    hasClass(el, name) {
        return el.classList ? el.classList.contains(name) : new RegExp(`\\b${name}\\b`).test(this.getDomClass(el));
    }

    /**
     * Trims whitespace from a string.
     * @param {string} str - The string to trim.
     * @returns {string} The trimmed string.
     */
    trim(str) {
        return str.trim();
    }
}
