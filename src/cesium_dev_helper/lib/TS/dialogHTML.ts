// 施工中...

/**
 * Enable dragging functionality for a dialog element.
 * @param el The HTML element representing the dialog container.
 */

// <div class="el-dialog">
//     <div class="el-dialog__header">
//         <!-- Header content, often containing title and close button -->
//     </div>
//     <div class="el-dialog__body">
//         <!-- Main content of the dialog -->
//     </div>
// </div>

export function dragDialogAt(el: HTMLElement) {
  // Find the header element of the dialog
  let dialogHeaderEl = el.querySelector('.el-dialog__header') as HTMLElement;

  // Ensure we have a valid dialog header element
  if (!dialogHeaderEl) {
    console.error('Header element not found.');
    return;
  }

  // Style the dialog header to indicate draggable behavior
  dialogHeaderEl.style.cursor = 'move';

  // Get the dialog DOM element
  const dragDom = el;

  // Function to get computed style cross-browser
  const getStyle = (dom: HTMLElement, attr: string) => {
    if (window.getComputedStyle) {
      return window.getComputedStyle(dom, null)[attr];
    } else {
      return (dom: HTMLElement, attr: string) =>
        (dom as any).currentStyle[attr]; // Fallback for IE
    }
  };

  // Handle mouse down event on the dialog header
  dialogHeaderEl.onmousedown = (e) => {
    // Calculate initial mouse position relative to the dialog header
    const disX = e.clientX - dialogHeaderEl.offsetLeft;
    const disY = e.clientY - dialogHeaderEl.offsetTop;

    // Get dimensions of the dialog and the screen
    const dragDomWidth = dragDom.offsetWidth;
    const dragDomHeight = dragDom.offsetHeight;
    const screenWidth = document.body.clientWidth;
    const screenHeight = document.body.clientHeight;

    // Calculate boundaries for dragging
    const minDragDomLeft = dragDom.offsetLeft;
    const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
    const minDragDomTop = dragDom.offsetTop;
    const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight;

    // Parse current left and top styles of the dialog
    let styL = getStyle(dragDom, 'left');
    let styT = getStyle(dragDom, 'top');

    // Convert left and top styles from percentage to pixels if necessary
    if (styL.includes('%')) {
      styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
      styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
    } else {
      styL = +styL.replace(/\px/g, '');
      styT = +styT.replace(/\px/g, '');
    }

    // Handle mouse move event
    document.onmousemove = function (e) {
      // Calculate new position based on mouse movement
      let left = e.clientX - disX;
      let top = e.clientY - disY;

      // Boundary checks to prevent dragging outside visible area
      if (-left > minDragDomLeft) {
        left = -minDragDomLeft;
      } else if (left > maxDragDomLeft) {
        left = maxDragDomLeft;
      }

      if (-top > minDragDomTop) {
        top = -minDragDomTop;
      } else if (top > maxDragDomTop) {
        top = maxDragDomTop;
      }

      // Apply new position styles to the dialog
      const cssText = `;left:${left + styL}px;top:${top + styT}px;`;
      dragDom.style.cssText += cssText;
      dragDom.setAttribute('data-pos', cssText);

      // Additional logic can be added here, such as emitting events
      // to notify the application about the drag operation.
    };

    // Handle mouse up event to stop dragging
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

export function closeDialog(el: HTMLElement) {
  // Implementation to close or hide the dialog
  el.style.display = 'none';
  // Additional logic as per your application's requirements
}

export function resizeDialog(el: HTMLElement, resizeHandle: HTMLElement) {
  resizeHandle.addEventListener('mousedown', (e) => {
    // Logic to start resizing
    // Adjust dialog size based on mouse movement
    // Example: el.style.width = newWidth;
    // Example: el.style.height = newHeight;
  });
}

export function showOverlay() {
  // Show overlay to prevent interactions with underlying content
}

export function hideOverlay() {
  // Hide overlay when modal or dialog is closed
}

export function focusDialog(el: HTMLElement) {
  // Set focus to dialog or specific element within it
  // Example: el.focus();
}

export function blurDialog(el: HTMLElement) {
  // Remove focus from dialog or element
  // Example: el.blur();
}

export function setAriaHidden(el: HTMLElement, hidden: boolean) {
  el.setAttribute('aria-hidden', hidden.toString());
}

export function manageFocusTrap(dialog: HTMLElement) {
  // Ensure focus stays within the dialog
}

export function addEventListenerOnce(
  element: HTMLElement,
  event: string,
  handler: any /* EventListenerOrEventListenerObject*/
) {
  const onceHandler = (e: Event) => {
    handler(e);
    element.removeEventListener(event, onceHandler);
  };
  element.addEventListener(event, onceHandler);
}

export function animateDialogOpen(el: HTMLElement) {
  // Apply animations or transitions for opening
}

export function animateDialogClose(el: HTMLElement) {
  // Apply animations or transitions for closing
}

const o = {
  dragDialogAt,
  closeDialog,
  resizeDialog,
  showOverlay,
  hideOverlay,
  focusDialog,
  blurDialog,
  setAriaHidden,
  manageFocusTrap,
  addEventListenerOnce,
  animateDialogOpen,
  animateDialogClose,
};
export default o;
