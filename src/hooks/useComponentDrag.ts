import { useRef } from "react";

export function useComponentDrag(onMove: (x: number, y: number) => void) {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  function handleMouseDown(
    e: React.MouseEvent,
    getCanvas: () => HTMLElement | null
  ) {
    dragging.current = true;
    offset.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
    function handleMouseMove(ev: MouseEvent) {
      if (!dragging.current) return;
      const canvas = getCanvas();
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left - offset.current.x;
      const y = ev.clientY - rect.top - offset.current.y;
      onMove(x, y);
    }
    function handleMouseUp() {
      dragging.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  return { handleMouseDown };
}
