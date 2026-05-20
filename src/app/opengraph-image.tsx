import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} - ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Loaded at module level: disk reads are cheap and the Node module cache keeps
// them warm across warm serverless invocations, eliminating a per-request
// Google Fonts fetch.
const fontBold = readFileSync(
  path.join(process.cwd(), "public/fonts/SpaceGrotesk-Bold.ttf"),
);
const fontRegular = readFileSync(
  path.join(process.cwd(), "public/fonts/SpaceGrotesk-Regular.ttf"),
);

export default async function Image() {
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
      {/* Portrait — 630×630 centered, sits between background and text */}
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
        {/* biome-ignore lint/performance/noImgElement: Satori renders a limited HTML subset and does not support next/image */}
        <img
          src={portraitSrc}
          alt=""
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Name + title — left clean zone (x=0 to x=285) */}
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
          padding: "0 18px",
        }}
      >
        <div
          style={{
            fontSize: 38,
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
            fontSize: 14,
            color: "#014a50",
            fontWeight: 400,
            letterSpacing: 2,
          }}
        >
          MECHATRONICS ENGINEER
        </div>
      </div>

      {/* Tagline + URL — right clean zone (x=915 to x=1200) */}
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
          padding: "0 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#0c1a1a",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            I build the robots.
          </div>
          <div
            style={{
              fontSize: 24,
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
