import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TextCardProps } from "./schema";

export function TextCard({ title, subtitle, backgroundColor, textColor, accentColor }: TextCardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 });
  const subtitleOpacity = spring({ frame: frame - 20, fps, from: 0, to: 1, durationInFrames: 30 });
  const titleY = interpolate(frame, [0, 30], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
          width: "4px",
          height: "60px",
          backgroundColor: accentColor,
          marginBottom: "32px",
          borderRadius: "2px",
          opacity: titleOpacity,
        }}
      />
      <h1
        style={{
          color: textColor,
          fontSize: "72px",
          fontWeight: "800",
          textAlign: "center",
          margin: 0,
          marginBottom: "24px",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "-2px",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          color: textColor + "aa",
          fontSize: "28px",
          textAlign: "center",
          margin: 0,
          opacity: subtitleOpacity,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
}
