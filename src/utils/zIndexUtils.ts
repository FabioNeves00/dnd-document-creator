import type { Component } from "../types";

export function bringForward(components: Component[], id: string): Component[] {
  const idx = components.findIndex((c) => c.id === id);
  if (idx === -1) return components;
  const maxZ = Math.max(...components.map((c) => c.zIndex ?? 0));
  return components.map((c) => (c.id === id ? { ...c, zIndex: maxZ + 1 } : c));
}

export function sendBackward(components: Component[], id: string): Component[] {
  const idx = components.findIndex((c) => c.id === id);
  if (idx === -1) return components;
  const minZ = Math.min(...components.map((c) => c.zIndex ?? 0));
  return components.map((c) => (c.id === id ? { ...c, zIndex: minZ - 1 } : c));
}
