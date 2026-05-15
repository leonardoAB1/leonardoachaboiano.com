import { readFileSync } from "fs";
import { ImageResponse } from "next/og";
import path from "path";
import { siteConfig } from "@/lib/constants";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} - ${siteConfig.title}`;
export const size = { width: 1200, height: 675 };
export const contentType = "image/png";

export default function Image() {
  const portraitBuffer = readFileSync(path.join(process.cwd(), "public/portrait.jpg"));
  const portraitSrc = `data:image/jpeg;base64,${portraitBuffer.toString("base64")}`;

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
        <div style={{ width: 12, background: "#02777C", flexShrink: 0 }} />

        {/* Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 48px 0 80px",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 62,
              color: "#f0f0f0",
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: 14,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#02777C",
              fontWeight: 400,
              marginBottom: 48,
            }}
          >
            {siteConfig.title}
          </div>
          <div
            style={{
              width: 64,
              height: 2,
              background: "#02777C",
              marginBottom: 48,
            }}
          />
          <div
            style={{
              fontSize: 18,
              color: "#3d6e70",
              letterSpacing: 1,
              marginBottom: 18,
            }}
          >
            {siteConfig.url.replace("https://", "")}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#02777C",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            View Portfolio →
          </div>
        </div>

        {/* Portrait */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 360,
            flexShrink: 0,
            paddingRight: 72,
          }}
        >
          {/* Outer div acts as teal ring */}
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "#02777C",
              padding: 4,
              display: "flex",
            }}
          >
            {/* Inner div clips portrait into circle */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
              }}
            >
              <img
                src={portraitSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
