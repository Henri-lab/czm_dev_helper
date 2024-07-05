import { ref, onMounted, onBeforeUnmount } from 'vue';

export default function useMousePosition() {
  const x = ref(-1);
  const y = ref(-1);
  const handler = (event: MouseEvent) => {
    x.value = event.pageX;
    y.value = event.pageY;
  };
  onMounted(() => {
    window.addEventListener('click', handler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', handler);
  });

  return {
    x,
    y,
  };
}
