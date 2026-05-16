import { readFileSync } from "fs";
import { ImageResponse } from "next/og";
import path from "path";
import { siteConfig } from "@/lib/constants";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} - ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONT_URL_BOLD =
  "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj4PVnskPMU.ttf";
const FONT_URL_REGULAR =
  "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMU.ttf";

export default async function Image() {
  const [fontBold, fontRegular] = await Promise.all([
    fetch(FONT_URL_BOLD).then((r) => r.arrayBuffer()),
    fetch(FONT_URL_REGULAR).then((r) => r.arrayBuffer()),
  ]);

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
          fontFamily: "Space Grotesk",
        }}
      >
        {/* Portrait — fills full card height */}
        <div
          style={{
            width: 460,
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

        {/* Text panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            gap: 0,
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: 68,
              color: "#f0f0f0",
              fontWeight: 700,
              lineHeight: 1.0,
              marginBottom: 20,
            }}
          >
            Leonardo Acha Boiano
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 16,
              color: "#02777C",
              fontWeight: 400,
              letterSpacing: 5,
              marginBottom: 44,
            }}
          >
            MECHATRONICS ENGINEER
          </div>

          {/* Tagline — two lines, each div has one child (Satori constraint) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 52,
            }}
          >
            <div style={{ fontSize: 23, color: "#7ab8bb", fontWeight: 400, lineHeight: 1.6 }}>
              I build the robots.
            </div>
            <div style={{ fontSize: 23, color: "#7ab8bb", fontWeight: 400, lineHeight: 1.6 }}>
              I&apos;m not one.
            </div>
          </div>

          {/* Domain */}
          <div
            style={{
              fontSize: 14,
              color: "#3d6e70",
              fontWeight: 400,
              letterSpacing: 2,
            }}
          >
            {siteConfig.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: fontBold, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
