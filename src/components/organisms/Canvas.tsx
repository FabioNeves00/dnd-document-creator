import React, { useCallback } from "react";
import type { Component as CanvasComponentType } from "../../types";
import CanvasComponent from "./CanvasComponent";

interface CanvasProps {
  components: CanvasComponentType[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onPropChange: (id: string, prop: string, value: string) => void;
}

const CANVAS_HEIGHT_PX = 1123; // px (paisagem)
const CANVAS_WIDTH_PX = 794; // px (paisagem)

const Canvas: React.FC<CanvasProps> = ({
  components,
  onDrop,
  onDragOver,
  onSelect,
  onMove,
  onPropChange,
}) => {
  const sortedComponentsByZIndex = [...components].sort(
    (a, b) => a.zIndex - b.zIndex
  );

  // Handlers otimizados
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDrop(e);
    },
    [onDrop]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragOver(e);
    },
    [onDragOver]
  );

  return (
    <div
      className="flex items-center justify-center w-full h-full bg-[#181c23]"
      style={{ minHeight: "600px", minWidth: "400px" }}
    >
      <main
        className="relative shadow-2xl border border-gray-400 bg-white"
        data-cy="canvas"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => onSelect(null)}
        style={{
          width: `${CANVAS_WIDTH_PX}px`,
          height: `${CANVAS_HEIGHT_PX}px`,
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        {sortedComponentsByZIndex.map((comp) => {
          // Limitar visualização: só renderiza se estiver dentro da folha
          const left = Math.max(
            0,
            Math.min(comp.x, CANVAS_WIDTH_PX - (comp.width || 120))
          );
          const top = Math.max(
            0,
            Math.min(comp.y, CANVAS_HEIGHT_PX - (comp.height || 32))
          );
          return (
            <div
              key={comp.id}
              style={{
                position: "absolute",
                left,
                top,
                width: comp.width || 120,
                height: comp.height || 32,
              }}
            >
              <CanvasComponent
                comp={comp}
                onSelect={onSelect}
                onMove={onMove}
                onPropChange={onPropChange}
              />
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Canvas;
