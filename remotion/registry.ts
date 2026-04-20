import { TextCard } from "./compositions/TextCard";
import type { ComponentType } from "react";

export const COMPOSITION_REGISTRY: Record<string, ComponentType<Record<string, unknown>>> = {
  TextCard: TextCard as ComponentType<Record<string, unknown>>,
};

export const COMPOSITION_META: Record<string, {
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  defaultProps: Record<string, unknown>;
}> = {
  TextCard: {
    durationInFrames: 150,
    fps: 30,
    width: 1920,
    height: 1080,
    defaultProps: {
      title: "Hello World",
      subtitle: "Your subtitle here",
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      accentColor: "#7c3aed",
    },
  },
};
