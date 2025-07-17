import { useState } from "react";
import type { Component } from "../types";
import { componentFactory } from "../utils/componentFactory";
import { bringForward, sendBackward } from "../utils/zIndexUtils";
import { clamp, updateComponentById, parseOptions } from "../utils/helpers";

export function useCanvasComponents() {
  const [canvasComponents, setCanvasComponents] = useState<Component[]>([]);
  const [currentDragType, setCurrentDragType] = useState<
    Component["type"] | null
  >(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );

  const CANVAS_HEIGHT_PX = 1123;
  const CANVAS_WIDTH_PX = 794;

  const handleComponentDragStart = (type: Component["type"]) =>
    setCurrentDragType(type);

  const handleCanvasDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (!currentDragType) return;
    const componentId = `${currentDragType}-${Date.now()}`;
    const canvasRect = (event.target as HTMLElement).getBoundingClientRect();
    let dropX = event.clientX - canvasRect.left;
    let dropY = event.clientY - canvasRect.top;
    dropX = clamp(dropX, 0, CANVAS_WIDTH_PX - 120);
    dropY = clamp(dropY, 0, CANVAS_HEIGHT_PX - 32);
    const maxZIndex = canvasComponents.reduce(
      (maximumZ, component) => Math.max(maximumZ, component.zIndex ?? 0),
      0
    );
    const newComponent = componentFactory(
      currentDragType,
      componentId,
      dropX,
      dropY,
      maxZIndex + 1
    );
    if (!newComponent) return;
    setCanvasComponents((prevComponents) => [...prevComponents, newComponent]);
    setCurrentDragType(null);
  };

  const handleCanvasDragOver = (event: React.DragEvent) =>
    event.preventDefault();

  const handleComponentSelect = (componentId: string | null) => {
    setSelectedComponentId(componentId);
    setCanvasComponents((prevComponents) =>
      prevComponents.map((component) => ({
        ...component,
        selected: component.id === componentId,
      }))
    );
  };

  const handleUpdateComponentProperty = (
    componentId: string,
    propertyName: string,
    propertyValue: string
  ) => {
    setCanvasComponents((prevComponents) =>
      updateComponentById(prevComponents, componentId, (component) => {
        if (propertyName === "options") {
          return { ...component, options: parseOptions(propertyValue) };
        }
        return { ...component, [propertyName]: propertyValue };
      })
    );
  };

  const handleComponentMove = (
    componentId: string,
    newX: number,
    newY: number
  ) => {
    const targetComponent = canvasComponents.find(
      (component) => component.id === componentId
    );
    if (!targetComponent) return;
    const componentWidth = targetComponent.width || 120;
    const componentHeight = targetComponent.height || 32;
    const clampedX = clamp(newX, 0, CANVAS_WIDTH_PX - componentWidth);
    const clampedY = clamp(newY, 0, CANVAS_HEIGHT_PX - componentHeight);
    setCanvasComponents((prevComponents) =>
      updateComponentById(prevComponents, componentId, (component) => ({
        ...component,
        x: clampedX,
        y: clampedY,
      }))
    );
  };

  const handleBringComponentForward = () => {
    if (!selectedComponentId) return;
    setCanvasComponents((prevComponents) =>
      bringForward(prevComponents, selectedComponentId)
    );
  };

  const handleSendComponentBackward = () => {
    if (!selectedComponentId) return;
    setCanvasComponents((prevComponents) =>
      sendBackward(prevComponents, selectedComponentId)
    );
  };

  const handleSelectedComponentPropertyChange = (
    propertyName: string | number | symbol,
    propertyValue: string | undefined
  ) => {
    if (!selectedComponentId) return;
    setCanvasComponents((prevComponents) =>
      updateComponentById(prevComponents, selectedComponentId, (component) => {
        if (propertyName === "fontSize") {
          const numericValue = propertyValue
            ? clamp(parseInt(propertyValue), 8, 100)
            : 16;
          return { ...component, [propertyName]: numericValue };
        }
        if (propertyName === "width" || propertyName === "height") {
          const numericValue = propertyValue
            ? clamp(
                parseInt(propertyValue),
                propertyName === "width" ? 50 : 20,
                propertyName === "width" ? 800 : 600
              )
            : propertyName === "width"
            ? 120
            : 32;
          return { ...component, [propertyName]: numericValue };
        }
        return { ...component, [propertyName]: propertyValue };
      })
    );
  };

  const handleComponentResize = (
    componentId: string,
    newWidth: number,
    newHeight: number
  ) => {
    setCanvasComponents((prevComponents) =>
      updateComponentById(prevComponents, componentId, (component) => ({
        ...component,
        width: newWidth,
        height: newHeight,
      }))
    );
  };

  const handleRemoveSelectedComponent = () => {
    if (!selectedComponentId) return;
    setCanvasComponents((prevComponents) =>
      prevComponents.filter((component) => component.id !== selectedComponentId)
    );
    setSelectedComponentId(null);
  };

  const selectedComponent = canvasComponents.find(
    (component) => component.id === selectedComponentId
  );

  return {
    canvasComponents,
    selectedComponent,
    handleDragStart: handleComponentDragStart,
    handleDrop: handleCanvasDrop,
    handleDragOver: handleCanvasDragOver,
    handleSelect: handleComponentSelect,
    handleMoveComponent: handleComponentMove,
    handlePropChangeComponent: handleUpdateComponentProperty,
    handleBringForward: handleBringComponentForward,
    handleSendBackward: handleSendComponentBackward,
    handlePropChange: handleSelectedComponentPropertyChange,
    handleRemoveComponent: handleRemoveSelectedComponent,
    handleResizeComponent: handleComponentResize,
  };
}
