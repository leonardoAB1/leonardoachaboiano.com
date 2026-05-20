import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} - ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONT_BOLD =
  "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj4PVnskPMU.ttf";
const FONT_REGULAR =
  "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMU.ttf";

export default async function Image() {
  const [fontBold, fontRegular] = await Promise.all([
    fetch(FONT_BOLD).then((r) => r.arrayBuffer()),
    fetch(FONT_REGULAR).then((r) => r.arrayBuffer()),
  ]);

  const portraitBuffer = readFileSync(
    path.join(process.cwd(), "public/portrait.jpg"),
  );
  const portraitSrc = `data:image/jpeg;base64,${portraitBuffer.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#cfead7",
        display: "flex",
        fontFamily: "Space Grotesk",
      }}
    >
      {/* Portrait — centered at x=600 (face at container center: 290+310=600) */}
      <div
        style={{
          position: "absolute",
          left: 290,
          top: 0,
          width: 620,
          height: "100%",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: Satori (next/og) renders a limited HTML subset and does not support next/image */}
        <img
          src={portraitSrc}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      </div>

      {/* Text — 80px padding, dark on mint background */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 680,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: 44,
            color: "#0c1a1a",
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: 18,
          }}
        >
          {siteConfig.name}
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#02777C",
            fontWeight: 400,
            letterSpacing: 5,
            marginBottom: 44,
          }}
        >
          MECHATRONICS ENGINEER
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 56,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#1a5a5e",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            I build the robots.
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#1a5a5e",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            I&apos;m not one.
          </div>
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#02777C",
            fontWeight: 400,
            letterSpacing: 2,
          }}
        >
          {siteConfig.url.replace("https://", "")}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: fontBold, weight: 700, style: "normal" },
        {
          name: "Space Grotesk",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
