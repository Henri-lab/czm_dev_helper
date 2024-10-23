export default {
    // @bug 移动限制
    mounted(el, bind) {
        document.addEventListener('click', (e) => {
            // Get the mouse click position
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Calculate the maximum allowable positions to keep the element inside the viewport
            const maxLeft = window.innerWidth - el.offsetWidth;
            const maxTop = window.innerHeight - el.offsetHeight;

            // Calculate the new position of the element
            const newLeft = Math.min(Math.max(0, mouseX), maxLeft);
            const newTop = Math.min(Math.max(0, mouseY), maxTop);

            // Update the element's position
            el.style.left = `${newLeft-500}px`;
            el.style.top = `${newTop-45}px`;

            // console.log(el);
        });
    }
}