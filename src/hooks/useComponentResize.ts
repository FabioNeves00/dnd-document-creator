import { useRef, useState, useCallback } from "react";

export function useComponentResize(onResize: (w: number, h: number) => void) {
  const [resizing, setResizing] = useState<null | {
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    direction: string;
  }>(null);

  const handleResizeMouseDown = useCallback(
    (dir: string, startWidth: number, startHeight: number) =>
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setResizing({
          startX: e.clientX,
          startY: e.clientY,
          startWidth,
          startHeight,
          direction: dir,
        });
      },
    []
  );

  const handleResizeMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!resizing) return;
      const dx = e.clientX - resizing.startX;
      const dy = e.clientY - resizing.startY;
      let newWidth = resizing.startWidth;
      let newHeight = resizing.startHeight;
      if (resizing.direction.includes("right")) newWidth += dx;
      if (resizing.direction.includes("left")) newWidth -= dx;
      if (resizing.direction.includes("bottom")) newHeight += dy;
      if (resizing.direction.includes("top")) newHeight -= dy;
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);
      onResize(Math.round(newWidth), Math.round(newHeight));
    },
    [resizing, onResize]
  );

  const handleResizeMouseUp = useCallback(() => {
    setResizing(null);
  }, []);

  return {
    resizing,
    handleResizeMouseDown,
    handleResizeMouseMove,
    handleResizeMouseUp,
  };
}
