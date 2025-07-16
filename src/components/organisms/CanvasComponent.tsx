import React, { useRef, useState } from "react";
import clsx from "clsx";
import type { Component as ComponentType, TextComponent } from "../../types";
import { useComponentDrag } from "../../hooks/useComponentDrag";
import { useComponentResize } from "../../hooks/useComponentResize";

const fontWeightMap = {
  normal: "font-normal",
  bold: "font-bold",
} satisfies Record<TextComponent["fontWeight"], string>;

const fontStyleMap = {
  normal: "not-italic",
  italic: "italic",
} satisfies Record<TextComponent["fontStyle"], string>;

const textDecorationMap = {
  none: "no-underline",
  underline: "underline",
} satisfies Record<TextComponent["textDecoration"], string>;

function isTextComponent(comp: ComponentType): comp is TextComponent {
  return comp.type === "textarea";
}

interface CanvasComponentProps {
  comp: ComponentType;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onPropChange?: (id: string, prop: string, value: string) => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  comp,
  onSelect,
  onMove,
  onPropChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const hasUserResizedRef = useRef(false);
  const initialContentRef = useRef<string>("");

  // Callbacks para os hooks
  const handleMove = (x: number, y: number) => {
    onMove(comp.id, x, y);
  };

  const handleResize = (width: number, height: number) => {
    hasUserResizedRef.current = true; // Marcar que usuário redimensionou
    onPropChange?.(comp.id, "width", String(width));
    onPropChange?.(comp.id, "height", String(height));
  };

  const { handleMouseDown } = useComponentDrag(handleMove);
  const { resizing, handleResizeMouseDown } = useComponentResize(handleResize);

  // Quando componente é criado, salvar conteúdo inicial
  React.useEffect(() => {
    if (isTextComponent(comp) && !initialContentRef.current) {
      initialContentRef.current = comp.content || "";
    }
  }, []);

  // Função para calcular altura necessária para o texto
  const calculateTextHeight = React.useCallback(() => {
    if (!isTextComponent(comp) || !comp.content || !measureRef.current)
      return null;

    const textComp = comp as TextComponent;
    const measureElement = measureRef.current;
    measureElement.style.width = `${textComp.width || 120}px`;
    measureElement.style.fontSize = `${textComp.fontSize || 16}px`;
    measureElement.style.fontWeight = textComp.fontWeight || "normal";
    measureElement.style.fontStyle = textComp.fontStyle || "normal";
    measureElement.style.textDecoration = textComp.textDecoration || "none";
    measureElement.style.padding = "4px";
    measureElement.style.lineHeight = "1.5";
    measureElement.style.whiteSpace = "pre-wrap";
    measureElement.style.wordWrap = "break-word";
    measureElement.textContent = textComp.content || null;

    const scrollHeight = measureElement.scrollHeight;
    return Math.max(32, scrollHeight);
  }, [comp]);

  // Auto-resize APENAS se:
  // 1. É um componente novo (sem resize manual ainda)
  // 2. Não está sendo redimensionado agora
  // 3. Conteúdo mudou significativamente do inicial
  React.useEffect(() => {
    if (!isTextComponent(comp) || !comp.content || !onPropChange) return;
    if (hasUserResizedRef.current || resizing || isEditing) return;

    // Só fazer auto-resize se é um componente "novo" (ainda não foi redimensionado)
    const contentChanged = comp.content !== initialContentRef.current;
    const isNewComponent = !hasUserResizedRef.current && contentChanged;

    if (isNewComponent) {
      const newHeight = calculateTextHeight();
      if (newHeight && Math.abs(newHeight - (comp.height || 32)) > 10) {
        // Delay para evitar conflitos
        const timeoutId = setTimeout(() => {
          if (!hasUserResizedRef.current && !resizing) {
            onPropChange(comp.id, "height", String(newHeight));
          }
        }, 200);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [comp.content, isEditing, resizing, calculateTextHeight, onPropChange]);

  // Foco ao entrar no modo edição
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
      // Resize apenas do textarea, não do componente
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  // Resize apenas do textarea durante edição (não mexe no componente)
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [comp.content, isEditing]);

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

  // Sair do modo edição
  const handleBlurOrEnter = (
    e:
      | React.FocusEvent<HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      ("type" in e && e.type === "blur") ||
      ("key" in e && (e.key === "Enter" || e.key === "Escape"))
    ) {
      setIsEditing(false);
    }
  };

  const getTextAlignClass = (align: TextComponent["textAlign"]) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      default:
        return "text-left";
    }
  };

  // Renderização condicional: só mostra textarea se isEditing
  const renderContent = () => {
    if (isTextComponent(comp)) {
      const textAlignClass = getTextAlignClass(comp.textAlign || "left");

      if (isEditing) {
        return (
          <textarea
            ref={inputRef}
            className={`bg-transparent border-none outline-none w-full resize-none ${textAlignClass}`}
            value={comp.content || ""}
            onChange={handleChange("content")}
            onBlur={handleBlurOrEnter}
            onKeyDown={handleBlurOrEnter}
            placeholder="Digite o texto"
            rows={1}
            style={{
              overflow: "hidden",
              color: comp.textColor || "#000",
              fontSize: `${comp.fontSize}px`,
              fontWeight: comp.fontWeight,
              fontStyle: comp.fontStyle,
              textDecoration: comp.textDecoration,
            }}
            data-cy="editing-textarea"
          />
        );
      }
      // Não está editando: mostra texto puro
      return (
        <div
          className={`w-full h-full break-words ${textAlignClass}`}
          style={{
            color: comp.textColor || "#000",
            cursor: "text",
            fontSize: `${comp.fontSize}px`,
            fontWeight: comp.fontWeight,
            fontStyle: comp.fontStyle,
            textDecoration: comp.textDecoration,
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
          data-cy="display-text"
        >
          {comp.content || (
            <span className="opacity-50">Clique duplo para editar</span>
          )}
        </div>
      );
    }

    if (comp.type === "image") {
      return (
        <div className="flex flex-col items-center w-full h-full">
          <img
            src={comp.content || "https://placehold.co/120x60?text=Imagem"}
            alt="Imagem"
            className="w-full h-full object-contain rounded bg-gray-700"
            draggable={false}
            style={{ pointerEvents: "none" }}
            data-cy="canvas-image"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Elemento invisível para medição de texto */}
      {isTextComponent(comp) && (
        <div
          ref={measureRef}
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            visibility: "hidden",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            lineHeight: "1.5",
          }}
          aria-hidden="true"
        />
      )}

      <div
        data-cy={`canvas-${comp.type}`}
        className={clsx(
          "border rounded p-1 mb-2 cursor-move select-none min-w-[120px] min-h-[32px] flex",
          comp.selected && "ring-2 ring-blue-500 selected",
          isTextComponent(comp) && fontWeightMap[comp.fontWeight],
          isTextComponent(comp) && fontStyleMap[comp.fontStyle],
          isTextComponent(comp) && textDecorationMap[comp.textDecoration],
          isTextComponent(comp) && getTextAlignClass(comp.textAlign || "left"),
          isTextComponent(comp) &&
            (comp.verticalAlign === "middle"
              ? "items-center"
              : comp.verticalAlign === "bottom"
              ? "items-end"
              : "items-start")
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(comp.id);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (isTextComponent(comp)) setIsEditing(true);
        }}
        onMouseDown={handleMouseDown}
        tabIndex={0}
        aria-label={`Componente ${comp.type}`}
        style={{
          userSelect: "none",
          width: comp.width ? comp.width + "px" : undefined,
          height: comp.height ? comp.height + "px" : undefined,
          position: "relative",
          background: comp.backgroundColor || "#181c23",
          color: comp.textColor || "#fff",
        }}
      >
        {renderContent()}
        {comp.selected && (
          <>
            {/* Handles de resize nos 4 cantos */}
            <div
              onMouseDown={handleResizeMouseDown(
                "bottom-right",
                comp.width || 120,
                comp.height || 32
              )}
              className="absolute right-0 bottom-0 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-20 border-2 border-white"
              style={{
                transform: "translate(50%, 50%)",
                pointerEvents: "auto",
              }}
              data-cy="resize-handle-br"
            />
            <div
              onMouseDown={handleResizeMouseDown(
                "bottom-left",
                comp.width || 120,
                comp.height || 32
              )}
              className="absolute left-0 bottom-0 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-20 border-2 border-white"
              style={{
                transform: "translate(-50%, 50%)",
                pointerEvents: "auto",
              }}
              data-cy="resize-handle-bl"
            />
            <div
              onMouseDown={handleResizeMouseDown(
                "top-right",
                comp.width || 120,
                comp.height || 32
              )}
              className="absolute right-0 top-0 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-20 border-2 border-white"
              style={{
                transform: "translate(50%, -50%)",
                pointerEvents: "auto",
              }}
              data-cy="resize-handle-tr"
            />
            <div
              onMouseDown={handleResizeMouseDown(
                "top-left",
                comp.width || 120,
                comp.height || 32
              )}
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
    </>
  );
};

export default CanvasComponent;
