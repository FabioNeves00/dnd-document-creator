import { useRef, useState, useCallback, useEffect } from "react";

export function useComponentDrag(onMove: (x: number, y: number) => void) {
  const [dragging, setDragging] = useState<boolean>(false);
  const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    offset.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;

      // Encontrar o canvas
      const canvas = document.querySelector(
        '[data-cy="canvas"]'
      ) as HTMLElement;
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

  // Event listeners globais
  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  return {
    dragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
