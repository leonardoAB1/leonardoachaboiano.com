import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { siteConfig } from "@/lib/constants";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} - ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

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

  // Satori only outputs PNG. PNG compresses photos poorly, so we post-process
  // the buffer through sharp to get a JPEG well under WhatsApp's 600 KB limit.
  const png = new ImageResponse(
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
      {/*
        Portrait — 630×630 div centered in the 1200×630 canvas.
        The source image has a circular crop painted on a #60c098 background
        so the corners blend invisibly into the canvas color.

        Circle geometry in OG canvas coordinates (1200×630):
          center : (600, 315)   — midpoint of the portrait div
          radius : 315 px       — half the div width (inscribed circle)

        Safe text zones: x=0–285 (left) and x=915–1200 (right).
        At mid-height (y=315) the circle reaches exactly to x=285 and x=915,
        so text must stay inside those bounds to avoid overlapping the face.
      */}
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

      {/* Name + title — left clean zone (x=0 to x=285), padded inward toward portrait */}
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
          padding: "0 8px 0 24px",
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

      {/* Tagline + URL — right clean zone (x=915 to x=1200), padded inward toward portrait */}
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
          padding: "0 24px 0 8px",
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

  const jpegBuffer = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();

  return new Response(new Uint8Array(jpegBuffer), {
    headers: { "Content-Type": "image/jpeg" },
  });
}
