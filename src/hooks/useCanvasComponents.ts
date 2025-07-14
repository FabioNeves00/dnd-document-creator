import { useState } from "react";
import type { Component } from "../types";
import { componentFactory } from "../utils/componentFactory";

export function useCanvasComponents() {
  const [canvasComponents, setCanvasComponents] = useState<Component[]>([]);
  const [dragType, setDragType] = useState<Component["type"] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDragStart = (type: Component["type"]) => setDragType(type);

  const A4_WIDTH = 1123;
  const A4_HEIGHT = 794;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragType) return;
    const id = `${dragType}-${Date.now()}`;
    const canvasRect = (e.target as HTMLElement).getBoundingClientRect();
    let x = e.clientX - canvasRect.left;
    let y = e.clientY - canvasRect.top;
    // Clamp para dentro da folha
    x = Math.max(0, Math.min(x, A4_WIDTH - 120));
    y = Math.max(0, Math.min(y, A4_HEIGHT - 32));
    const maxZ = canvasComponents.reduce(
      (max, c) => Math.max(max, c.zIndex ?? 0),
      0
    );
    const newComponent = componentFactory(dragType, id, x, y, maxZ + 1);
    if (!newComponent) return;
    setCanvasComponents((prev) => [...prev, newComponent]);
    setDragType(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setCanvasComponents((prev) =>
      prev.map((c) => ({ ...c, selected: c.id === id }))
    );
  };

  const handlePropChangeComponent = (
    id: string,
    prop: string,
    value: string
  ) => {
    setCanvasComponents((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (prop === "options") {
          return {
            ...c,
            options: value
              .split(",")
              .map((opt) => opt.trim())
              .filter(Boolean),
          };
        }
        return { ...c, [prop]: value };
      })
    );
  };

  const handleMoveComponent = (id: string, x: number, y: number) => {
    // Clamp para dentro da folha
    const comp = canvasComponents.find((c) => c.id === id);
    if (!comp) return;
    const width = comp.width || 120;
    const height = comp.height || 32;
    const clampedX = Math.max(0, Math.min(x, A4_WIDTH - width));
    const clampedY = Math.max(0, Math.min(y, A4_HEIGHT - height));
    setCanvasComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x: clampedX, y: clampedY } : c))
    );
  };

  const handleBringForward = () => {
    if (!selectedId) return;
    setCanvasComponents((prev) => {
      const idx = prev.findIndex((c) => c.id === selectedId);
      if (idx === -1) return prev;
      const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
      const current = sorted.find((c) => c.id === selectedId);
      if (!current) return prev;
      const currentIdx = sorted.indexOf(current);
      if (currentIdx === sorted.length - 1) return prev;
      const next = sorted[currentIdx + 1];
      [current.zIndex, next.zIndex] = [next.zIndex, current.zIndex];
      return [...sorted];
    });
  };

  const handleSendBackward = () => {
    if (!selectedId) return;
    setCanvasComponents((prev) => {
      const idx = prev.findIndex((c) => c.id === selectedId);
      if (idx === -1) return prev;
      const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
      const current = sorted.find((c) => c.id === selectedId);
      if (!current) return prev;
      const currentIdx = sorted.indexOf(current);
      if (currentIdx === 0) return prev;
      const prevComp = sorted[currentIdx - 1];
      [current.zIndex, prevComp.zIndex] = [prevComp.zIndex, current.zIndex];
      return [...sorted];
    });
  };

  const handlePropChange = (
    prop: string | number | symbol,
    value: string | undefined
  ) => {
    setCanvasComponents((prev) =>
      prev.map((c) => {
        if (c.id !== selectedId) return c;
        if (prop === "options") {
          return {
            ...c,
            options: value
              ? value
                  .split(",")
                  .map((opt) => opt.trim())
                  .filter(Boolean)
              : [],
          };
        }
        if (prop === "width" || prop === "height") {
          const num = value
            ? Math.max(20, Math.min(1000, parseInt(value)))
            : undefined;
          return { ...c, [prop]: num };
        }
        if (prop === "fontSize" || prop === "fontWeight") {
          return { ...c, [prop]: value };
        }
        return { ...c, [prop]: value };
      })
    );
  };

  const handleRemoveComponent = () => {
    if (!selectedId) return;
    setCanvasComponents((prev) => prev.filter((c) => c.id !== selectedId));
    setSelectedId(null);
  };

  const selectedComponent = canvasComponents.find((c) => c.id === selectedId);

  return {
    canvasComponents,
    selectedComponent,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleSelect,
    handleMoveComponent,
    handlePropChangeComponent,
    handleBringForward,
    handleSendBackward,
    handlePropChange,
    handleRemoveComponent,
  };
}
