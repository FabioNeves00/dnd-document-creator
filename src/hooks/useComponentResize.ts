import { useState } from "react";

interface UseComponentResizeProps {
  onResize: (width: number, height: number) => void;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const useComponentResize = ({
  onResize,
  minWidth = 50,
  minHeight = 20,
  maxWidth = 800,
  maxHeight = 600,
}: UseComponentResizeProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  const getDocumentCursor = (direction: string) => {
    switch (direction) {
      case "top-left":
      case "bottom-right":
        return "nw-resize";
      case "top-right":
      case "bottom-left":
        return "ne-resize";
      case "top":
      case "bottom":
        return "ns-resize";
      case "left":
      case "right":
        return "ew-resize";
      default:
        return "default";
    }
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    direction: string,
    currentWidth: number,
    currentHeight: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeDirection(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: currentWidth, height: currentHeight });

    // Aplicar cursor ao documento durante redimensionamento
    document.body.style.cursor = getDocumentCursor(direction);
    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;

      // Calcular novo tamanho baseado na direção
      if (direction.includes("right")) {
        newWidth = Math.max(
          minWidth,
          Math.min(maxWidth, startSize.width + deltaX)
        );
      }
      if (direction.includes("left")) {
        newWidth = Math.max(
          minWidth,
          Math.min(maxWidth, startSize.width - deltaX)
        );
      }
      if (direction.includes("bottom")) {
        newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, startSize.height + deltaY)
        );
      }
      if (direction.includes("top")) {
        newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, startSize.height - deltaY)
        );
      }

      onResize(Math.round(newWidth), Math.round(newHeight));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection("");

      // Restaurar cursor e seleção do documento
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return {
    isResizing,
    resizeDirection,
    handleResizeStart,
  };
};
