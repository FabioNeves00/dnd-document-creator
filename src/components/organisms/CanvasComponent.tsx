import React, { useRef } from "react";
import clsx from "clsx";
import type { Component as ComponentType, TextComponent } from "../../types";

const fontSizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
} satisfies Record<TextComponent["fontSize"], string>;

const fontWeightMap = {
  normal: "font-normal",
  bold: "font-bold",
} satisfies Record<TextComponent["fontWeight"], string>;

function isTextComponent(comp: ComponentType): comp is TextComponent {
  return (
    comp.type === "textbox" || comp.type === "textarea" || comp.type === "input"
  );
}

interface CanvasComponentProps {
  comp: ComponentType;
  onSelect: (id: string) => void;
  onMove?: (id: string, x: number, y: number) => void;
  onPropChange?: (id: string, prop: string, value: string) => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  comp,
  onSelect,
  onMove,
  onPropChange,
}) => {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onMove) return;
    dragging.current = true;
    offset.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current || !onMove) return;
    const canvas = (e.target as HTMLElement).closest(
      '[data-cy="canvas"]'
    ) as HTMLElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.current.x;
    const y = e.clientY - rect.top - offset.current.y;
    onMove(comp.id, x, y);
  };

  const handleMouseUp = () => {
    dragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  // Handles de resize
  const resizing = useRef<null | {
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    direction: string;
  }>(null);

  const handleResizeMouseDown = (dir: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onPropChange) return;
    resizing.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: comp.width || 120,
      startHeight: comp.height || 32,
      direction: dir,
    };
    window.addEventListener("mousemove", handleResizeMouseMove);
    window.addEventListener("mouseup", handleResizeMouseUp);
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!resizing.current || !onPropChange) return;
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
    onPropChange(comp.id, "width", String(Math.round(newWidth)));
    onPropChange(comp.id, "height", String(Math.round(newHeight)));
  };

  const handleResizeMouseUp = () => {
    resizing.current = null;
    window.removeEventListener("mousemove", handleResizeMouseMove);
    window.removeEventListener("mouseup", handleResizeMouseUp);
  };

  // Edição inline
  const handleChange =
    (prop: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      onPropChange?.(comp.id, prop, e.target.value);
    };

  const textAlignClass = isTextComponent(comp)
    ? comp.textAlign === "center"
      ? "text-center"
      : comp.textAlign === "right"
      ? "text-right"
      : "text-left"
    : "";

  return (
    <div
      data-cy={`canvas-${comp.type}`}
      className={clsx(
        "border rounded p-2 mb-2 cursor-move select-none min-w-[120px] min-h-[32px] flex",
        comp.selected && "ring-2 ring-blue-500 selected",
        isTextComponent(comp) && fontSizeMap[comp.fontSize],
        isTextComponent(comp) && fontWeightMap[comp.fontWeight],
        isTextComponent(comp) &&
          (comp.textAlign === "center"
            ? "text-center"
            : comp.textAlign === "right"
            ? "text-right"
            : "text-left"),
        isTextComponent(comp) &&
          (comp.verticalAlign === "middle"
            ? "items-center"
            : comp.verticalAlign === "bottom"
            ? "items-end"
            : "items-start")
      )}
      onClick={() => onSelect(comp.id)}
      onMouseDown={handleMouseDown}
      tabIndex={0}
      aria-label={comp.type}
      style={{
        userSelect: "none",
        width: comp.width ? comp.width + "px" : undefined,
        height: comp.height ? comp.height + "px" : undefined,
        position: "relative",
        background: comp.backgroundColor || "#181c23",
        color: comp.textColor || "#fff",
      }}
    >
      {comp.type === "textbox" && (
        <textarea
          className={`bg-transparent border-none outline-none w-full text-gray-100 resize-none ${textAlignClass}`}
          value={comp.content || ""}
          onChange={(e) => {
            handleChange("content")(e);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
            onPropChange?.(comp.id, "height", String(e.target.scrollHeight));
          }}
          placeholder="Texto"
          rows={1}
          style={{ overflow: "hidden" }}
        />
      )}
      {comp.type === "textarea" && (
        <textarea
          className={`bg-transparent border-none outline-none w-full text-gray-100 resize-none ${textAlignClass}`}
          value={comp.content || ""}
          onChange={(e) => {
            handleChange("content")(e);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
            onPropChange?.(comp.id, "height", String(e.target.scrollHeight));
          }}
          placeholder="Área de texto"
          rows={1}
          style={{ overflow: "hidden" }}
        />
      )}
      {comp.type === "input" && (
        <textarea
          className={`bg-transparent border-none outline-none w-full text-gray-100 resize-none ${textAlignClass}`}
          value={comp.content || ""}
          onChange={(e) => {
            handleChange("content")(e);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
            onPropChange?.(comp.id, "height", String(e.target.scrollHeight));
          }}
          placeholder="Campo de entrada"
          rows={1}
          style={{ overflow: "hidden" }}
        />
      )}
      {comp.type === "button" && (
        <textarea
          className={`bg-transparent border-none outline-none w-full text-gray-100 resize-none text-center ${textAlignClass}`}
          value={comp.content || ""}
          onChange={(e) => {
            handleChange("content")(e);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
            onPropChange?.(comp.id, "height", String(e.target.scrollHeight));
          }}
          placeholder="Botão"
          rows={1}
          style={{ overflow: "hidden" }}
        />
      )}
      {comp.type === "image" && (
        <div className="flex flex-col items-center w-full">
          <img
            src={comp.content || "https://placehold.co/120x60?text=Imagem"}
            alt="Imagem"
            className="max-w-[120px] max-h-[60px] object-contain rounded bg-gray-700"
            draggable={false}
            style={{ pointerEvents: "none" }}
          />
          <input
            className="mt-1 bg-transparent border border-[#2d3646] rounded p-1 text-xs text-gray-200 w-full"
            value={comp.content || ""}
            onChange={handleChange("content")}
            placeholder="URL da imagem"
            style={{ pointerEvents: "auto" }}
          />
        </div>
      )}
      {comp.selected && (
        <>
          {/* Handles de resize nos 4 cantos */}
          <div
            onMouseDown={handleResizeMouseDown("bottom-right")}
            className="absolute right-0 bottom-0 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-20 border-2 border-white"
            style={{ transform: "translate(50%, 50%)", pointerEvents: "auto" }}
            data-cy="resize-handle-br"
          />
          <div
            onMouseDown={handleResizeMouseDown("bottom-left")}
            className="absolute left-0 bottom-0 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-20 border-2 border-white"
            style={{ transform: "translate(-50%, 50%)", pointerEvents: "auto" }}
            data-cy="resize-handle-bl"
          />
          <div
            onMouseDown={handleResizeMouseDown("top-right")}
            className="absolute right-0 top-0 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-20 border-2 border-white"
            style={{ transform: "translate(50%, -50%)", pointerEvents: "auto" }}
            data-cy="resize-handle-tr"
          />
          <div
            onMouseDown={handleResizeMouseDown("top-left")}
            className="absolute left-0 top-0 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-20 border-2 border-white"
            style={{
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
            }}
            data-cy="resize-handle-tl"
          />
        </>
      )}
    </div>
  );
};

export default CanvasComponent;
