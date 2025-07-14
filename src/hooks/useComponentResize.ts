import { useRef } from "react";

export function useComponentResize(onResize: (w: number, h: number) => void) {
  const resizing = useRef<null | {
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    direction: string;
  }>(null);

  function handleResizeMouseDown(
    dir: string,
    startWidth: number,
    startHeight: number
  ) {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      resizing.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth,
        startHeight,
        direction: dir,
      };
      window.addEventListener("mousemove", handleResizeMouseMove);
      window.addEventListener("mouseup", handleResizeMouseUp);
    };
  }

  function handleResizeMouseMove(e: MouseEvent) {
    if (!resizing.current) return;
    const dx = e.clientX - resizing.current.startX;
    const dy = e.clientY - resizing.current.startY;
    let newWidth = resizing.current.startWidth;
    let newHeight = resizing.current.startHeight;
    if (resizing.current.direction.includes("right")) newWidth += dx;
    if (resizing.current.direction.includes("left")) newWidth -= dx;
    if (resizing.current.direction.includes("bottom")) newHeight += dy;
    if (resizing.current.direction.includes("top")) newHeight -= dy;
    newWidth = Math.max(20, newWidth);
    newHeight = Math.max(20, newHeight);
    onResize(Math.round(newWidth), Math.round(newHeight));
  }

  function handleResizeMouseUp() {
    resizing.current = null;
    window.removeEventListener("mousemove", handleResizeMouseMove);
    window.removeEventListener("mouseup", handleResizeMouseUp);
  }

  return { handleResizeMouseDown };
}
