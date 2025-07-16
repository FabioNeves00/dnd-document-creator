// Centralização de helpers reutilizáveis
import type { Component } from "../types";

export const clamp = (
  value: number,
  minValue: number,
  maxValue: number
): number => Math.max(minValue, Math.min(maxValue, value));

export const updateComponentById = (
  components: Component[],
  componentId: string,
  updater: (component: Component) => Component
): Component[] =>
  components.map((component) =>
    component.id === componentId ? updater(component) : component
  );

export const parseOptions = (value: string): string[] =>
  value
    .split(",")
    .map((option) => option.trim())
    .filter(Boolean);
