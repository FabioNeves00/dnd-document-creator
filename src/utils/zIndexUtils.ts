import type { Component } from "../types";

export function bringForward(
  components: Component[],
  componentId: string
): Component[] {
  const componentIndex = components.findIndex(
    (component) => component.id === componentId
  );
  if (componentIndex === -1) return components;
  const maxZIndex = Math.max(
    ...components.map((component) => component.zIndex ?? 0)
  );
  return components.map((component) =>
    component.id === componentId
      ? { ...component, zIndex: maxZIndex + 1 }
      : component
  );
}

export function sendBackward(
  components: Component[],
  componentId: string
): Component[] {
  const componentIndex = components.findIndex(
    (component) => component.id === componentId
  );
  if (componentIndex === -1) return components;
  const minZIndex = Math.min(
    ...components.map((component) => component.zIndex ?? 0)
  );
  return components.map((component) =>
    component.id === componentId
      ? { ...component, zIndex: minZIndex - 1 }
      : component
  );
}
