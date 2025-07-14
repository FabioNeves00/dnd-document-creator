import React from "react";
import type { Component as CanvasComponentType } from "../../types";
import CanvasComponent from "./CanvasComponent";

interface CanvasProps {
  components: CanvasComponentType[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onPropChange: (id: string, prop: string, value: string) => void;
}

const A4_WIDTH = 1123; // px (paisagem)
const A4_HEIGHT = 794; // px (paisagem)

const Canvas: React.FC<CanvasProps> = ({
  components,
  onDrop,
  onDragOver,
  onSelect,
  onMove,
  onPropChange,
}) => {
  const sorted = [...components].sort((a, b) => a.zIndex - b.zIndex);
  return (
    <div
      className="flex items-center justify-center w-full h-full bg-[#181c23]"
      style={{ minHeight: "600px", minWidth: "400px" }}
    >
      <main
        className="relative shadow-2xl border border-gray-400 bg-white"
        data-cy="canvas"
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{
          width: `${A4_WIDTH}px`,
          height: `${A4_HEIGHT}px`,
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        {sorted.map((comp) => {
          // Limitar visualização: só renderiza se estiver dentro da folha
          const left = Math.max(
            0,
            Math.min(comp.x, A4_WIDTH - (comp.width || 120))
          );
          const top = Math.max(
            0,
            Math.min(comp.y, A4_HEIGHT - (comp.height || 32))
          );
          return (
            <div
              key={comp.id}
              style={{
                position: "absolute",
                left,
                top,
                zIndex: comp.zIndex,
                width: comp.width ? comp.width + "px" : undefined,
                height: comp.height ? comp.height + "px" : undefined,
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
