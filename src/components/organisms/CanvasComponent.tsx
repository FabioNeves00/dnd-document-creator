/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import clsx from "clsx";
import type {
  Component as ComponentType,
  TextComponent,
  DividerComponent,
  SignatureComponent,
} from "../../types";
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
  "line-through": "line-through",
} satisfies Record<TextComponent["textDecoration"], string>;

function isTextComponent(comp: ComponentType): comp is TextComponent {
  return comp.type === "textarea";
}

function isDividerComponent(comp: ComponentType): comp is DividerComponent {
  return comp.type === "divider";
}

function isSignatureComponent(comp: ComponentType): comp is SignatureComponent {
  return comp.type === "signature";
}

interface CanvasComponentProps {
  comp: ComponentType;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onPropChange?: (id: string, prop: string, value: string) => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  comp,
  onSelect,
  onMove,
  onResize,
  onPropChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Callbacks para os hooks
  const handleMove = (x: number, y: number) => {
    onMove(comp.id, x, y);
  };

  const handleResize = (width: number, height: number) => {
    onResize?.(comp.id, width, height);
  };

  const { handleMouseDown } = useComponentDrag(handleMove);
  const { handleResizeStart } = useComponentResize({
    onResize: handleResize,
    minWidth: 50,
    minHeight: 20,
    maxWidth: 800,
    maxHeight: 600,
  });

  // Foco ao entrar no modo edição
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, [isEditing]);

  // Auto-resize do textarea durante edição (SEM afetar o componente)
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
    // Componentes de texto editáveis
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
              lineHeight: "1.5",
              padding: "4px",
              boxSizing: "border-box",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
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
            lineHeight: "1.5",
            padding: "4px",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap",
          }}
          data-cy="display-text"
        >
          {comp.content || (
            <span className="opacity-50">Clique duplo para editar</span>
          )}
        </div>
      );
    }

    // Componente Divider
    if (isDividerComponent(comp)) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-full"
            style={{
              height: `${comp.thickness}px`,
              backgroundColor:
                comp.lineStyle === "solid" ? comp.lineColor : "transparent",
              borderTop:
                comp.lineStyle !== "solid"
                  ? `${comp.thickness}px ${comp.lineStyle} ${comp.lineColor}`
                  : "none",
            }}
            data-cy="divider-line"
          />
        </div>
      );
    }

    // Componente Signature
    if (isSignatureComponent(comp)) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
          <div
            className="border-b"
            style={{
              width: `${comp.lineWidth}px`,
              borderColor: comp.lineColor,
              borderBottomWidth: "1px",
            }}
            data-cy="signature-line"
          />
          <div
            className="text-center"
            style={{
              fontSize: `${comp.fontSize}px`,
              fontWeight: comp.fontWeight,
              color: comp.textColor || "#000",
              textAlign: comp.textAlign,
            }}
            data-cy="signature-text"
          >
            {comp.signatureText}
          </div>
        </div>
      );
    }

    // Componente Image
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

  const currentWidth = comp.width || 120;
  const currentHeight = comp.height || 32;

  const getCursorClass = (direction: string) => {
    switch (direction) {
      case "top-left":
      case "bottom-right":
        return "cursor-nw-resize";
      case "top-right":
      case "bottom-left":
        return "cursor-ne-resize";
      case "top":
      case "bottom":
        return "cursor-ns-resize";
      case "left":
      case "right":
        return "cursor-ew-resize";
      default:
        return "cursor-pointer";
    }
  };

  const ResizeHandle = ({
    direction,
    className,
  }: {
    direction: string;
    className: string;
  }) => (
    <div
      className={`absolute ${className} w-2 h-2 bg-blue-500 border border-white ${getCursorClass(
        direction
      )} z-10 hover:bg-blue-600 transition-colors`}
      onMouseDown={(e) =>
        handleResizeStart(e, direction, currentWidth, currentHeight)
      }
      data-cy={`resize-handle-${direction}`}
      title={`Redimensionar ${direction.replace("-", " ")}`}
    />
  );

  return (
    <>
      <div
        data-cy={`canvas-${comp.type}`}
        className={clsx(
          "rounded p-1 mb-2 cursor-move select-none min-w-[120px] min-h-[32px] flex",
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

        {/* Handles de redimensionamento - apenas quando selecionado */}
        {comp.selected && (
          <>
            <ResizeHandle direction="top-left" className="-top-1 -left-1" />
            <ResizeHandle direction="top-right" className="-top-1 -right-1" />
            <ResizeHandle
              direction="bottom-left"
              className="-bottom-1 -left-1"
            />
            <ResizeHandle
              direction="bottom-right"
              className="-bottom-1 -right-1"
            />
            <ResizeHandle
              direction="top"
              className="-top-1 left-1/2 transform -translate-x-1/2"
            />
            <ResizeHandle
              direction="bottom"
              className="-bottom-1 left-1/2 transform -translate-x-1/2"
            />
            <ResizeHandle
              direction="left"
              className="top-1/2 -left-1 transform -translate-y-1/2"
            />
            <ResizeHandle
              direction="right"
              className="top-1/2 -right-1 transform -translate-y-1/2"
            />
          </>
        )}
      </div>
    </>
  );
};

export default CanvasComponent;
