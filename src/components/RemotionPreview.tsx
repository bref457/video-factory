"use client";

import { Player } from "@remotion/player";
import { COMPOSITION_REGISTRY, COMPOSITION_META } from "../../remotion/registry";

interface RemotionPreviewProps {
  compositionId: string;
  inputProps?: Record<string, unknown>;
}

export function RemotionPreview({ compositionId, inputProps = {} }: RemotionPreviewProps) {
  const Component = COMPOSITION_REGISTRY[compositionId];
  const meta = COMPOSITION_META[compositionId];

  if (!Component || !meta) {
    return (
      <div className="bg-gray-900 rounded-lg flex items-center justify-center h-48 text-gray-500">
        Komposition nicht gefunden: {compositionId}
      </div>
    );
  }

  const mergedProps = { ...meta.defaultProps, ...inputProps };

  return (
    <Player
      component={Component}
      inputProps={mergedProps}
      durationInFrames={meta.durationInFrames}
      compositionWidth={meta.width}
      compositionHeight={meta.height}
      fps={meta.fps}
      style={{ width: "100%", aspectRatio: `${meta.width}/${meta.height}`, borderRadius: "8px" }}
      controls
    />
  );
}
