import { useState, useCallback, useEffect } from "react";
import { clamp } from "../utils/helpers";

export function useComponentResize(onResize: (w: number, h: number) => void) {
  const [resizing, setResizing] = useState<null | {
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    direction: string;
  }>(null);

  const handleResizeMouseDown = useCallback(
    (direction: string, startWidth: number, startHeight: number) =>
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setResizing({
          startX: e.clientX,
          startY: e.clientY,
          startWidth,
          startHeight,
          direction,
        });
      },
    []
  );

  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing) return;
      const dx = e.clientX - resizing.startX;
      const dy = e.clientY - resizing.startY;
      let newWidth = resizing.startWidth;
      let newHeight = resizing.startHeight;
      if (resizing.direction.includes("right")) newWidth += dx;
      if (resizing.direction.includes("left")) newWidth -= dx;
      if (resizing.direction.includes("bottom")) newHeight += dy;
      if (resizing.direction.includes("top")) newHeight -= dy;
      newWidth = clamp(newWidth, 20, 1000);
      newHeight = clamp(newHeight, 20, 1000);
      onResize(Math.round(newWidth), Math.round(newHeight));
    },
    [resizing, onResize]
  );

  const handleResizeMouseUp = useCallback(() => {
    setResizing(null);
  }, []);

  // Event listeners globais
  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleResizeMouseMove);
      document.addEventListener("mouseup", handleResizeMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleResizeMouseMove);
        document.removeEventListener("mouseup", handleResizeMouseUp);
      };
    }
  }, [resizing, handleResizeMouseMove, handleResizeMouseUp]);

  return {
    resizing,
    handleResizeMouseDown,
    handleResizeMouseMove,
    handleResizeMouseUp,
  };
}
