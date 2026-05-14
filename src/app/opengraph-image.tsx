import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Leonardo Acha Boiano - Mechatronics Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        background: "#0a0a0a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
          color: "#02777C",
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 16,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Portfolio
      </div>
      <div
        style={{
          color: "#f5f5f5",
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 24,
        }}
      >
        Leonardo Acha Boiano
      </div>
      <div
        style={{
          color: "#a3a3a3",
          fontSize: 32,
          fontWeight: 400,
        }}
      >
        Mechatronics Engineer
      </div>
      <div
        style={{
          color: "#525252",
          fontSize: 20,
          marginTop: 16,
        }}
      >
        Robotics - Embedded Systems - Hardware Integration
      </div>
    </div>,
    size,
  );
}
