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

  const portraitSrc = `${siteConfig.url}/portrait.jpg`;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#60c098",
        display: "flex",
        fontFamily: "Space Grotesk",
      }}
    >
      {/* Portrait — 630×630 square centered, sits between background and text */}
      <div
        style={{
          position: "absolute",
          left: 285,
          top: 0,
          width: 630,
          height: 630,
          display: "flex",
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: Satori (next/og) renders a limited HTML subset and does not support next/image */}
        <img
          src={portraitSrc}
          alt=""
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Tagline + URL — left clean zone (x=0 to x=285), before the portrait */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 285,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 28px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#0c1a1a",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            I build the robots.
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#0c1a1a",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            I&apos;m not one.
          </div>
        </div>

        <div
          style={{
            fontSize: 14,
            color: "#014a50",
            fontWeight: 400,
            letterSpacing: 2,
          }}
        >
          {siteConfig.url.replace("https://", "")}
        </div>
      </div>

      {/* Name + title — right clean zone (x=915 to x=1200), after the portrait */}
      <div
        style={{
          position: "absolute",
          left: 915,
          top: 0,
          width: 285,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#0c1a1a",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 14,
          }}
        >
          {siteConfig.name}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#014a50",
            fontWeight: 400,
            letterSpacing: 1.5,
          }}
        >
          MECHATRONICS ENGINEER
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
