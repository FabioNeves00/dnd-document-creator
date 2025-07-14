import { useRef, useState, useCallback } from "react";

export function useComponentDrag(onMove: (x: number, y: number) => void) {
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, getCanvas: () => HTMLElement | null) => {
      setDragging(true);
      offset.current = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, getCanvas: () => HTMLElement | null) => {
      if (!dragging) return;
      const canvas = getCanvas();
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - offset.current.x;
      const y = e.clientY - rect.top - offset.current.y;
      onMove(x, y);
    },
    [dragging, onMove]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  return { dragging, handleMouseDown, handleMouseMove, handleMouseUp };
}
