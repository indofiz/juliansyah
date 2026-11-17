import { ImageResponse } from "next/og";
import { defaultPalette as palette, hexAlpha } from "@/lib/palettes";

export const ogSize = { width: 1200, height: 630 };

/**
 * Shared Open Graph card: dark canvas, accent glow, eyebrow, big title,
 * footer line. Always the default palette: link previews can't know which
 * one a visitor picked.
 */
export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `radial-gradient(70% 90% at 85% 110%, ${hexAlpha(palette.rgb.accent, 0.55)}, ${hexAlpha(palette.rgb["accent-2"], 0.18)} 45%, rgba(6,4,3,0) 75%), ${palette.scene.canvas}`,
          color: "#f5f3f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: palette.rgb.accent }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: palette.rgb.accent }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 56 : 68, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 26, color: "#a69f99" }}>{footer}</div>
      </div>
    ),
    ogSize,
  );
}
