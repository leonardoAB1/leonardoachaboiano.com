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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          background: "#0c1a1a",
        }}
      >
        {/* Portrait — fills full card height, face centered */}
        <div
          style={{
            width: 480,
            height: "100%",
            flexShrink: 0,
            display: "flex",
            overflow: "hidden",
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

        {/* Teal separator */}
        <div style={{ width: 4, background: "#02777C", flexShrink: 0 }} />

        {/* Text panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
          }}
        >
          {/* Small accent line */}
          <div
            style={{
              width: 48,
              height: 3,
              background: "#02777C",
              marginBottom: 44,
            }}
          />

          {/* Name */}
          <div
            style={{
              fontSize: 54,
              color: "#f0f0f0",
              fontWeight: 700,
              lineHeight: 1.0,
              marginBottom: 18,
            }}
          >
            Leonardo Acha Boiano
          </div>

          {/* Title — spaced caps */}
          <div
            style={{
              fontSize: 18,
              color: "#02777C",
              fontWeight: 500,
              letterSpacing: 4,
              marginBottom: 44,
            }}
          >
            MECHATRONICS ENGINEER
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 22,
              color: "#7ab8bb",
              lineHeight: 1.5,
              marginBottom: 60,
            }}
          >
            I build the robots. I&apos;m not one.
          </div>

          {/* Domain */}
          <div
            style={{
              fontSize: 15,
              color: "#3d6e70",
              letterSpacing: 2,
            }}
          >
            {siteConfig.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
