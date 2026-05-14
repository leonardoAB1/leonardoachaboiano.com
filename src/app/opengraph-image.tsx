import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${siteConfig.name} - ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0c1a1a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
        }}
      >
        {/* Left accent bar */}
        <div style={{ width: 14, background: "#02777C", flexShrink: 0 }} />

        {/* Content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 96px",
            gap: 0,
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "#02777C",
              letterSpacing: 5,
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Engineering Portfolio
          </div>
          <div
            style={{
              fontSize: 76,
              color: "#f0f0f0",
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            Leonardo Acha Boiano
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#7ab8bb",
              fontWeight: 400,
              marginBottom: 56,
            }}
          >
            Mechatronics &amp; Robotics Engineer
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#3d6e70",
              letterSpacing: 1,
            }}
          >
            leonardoachaboiano.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
