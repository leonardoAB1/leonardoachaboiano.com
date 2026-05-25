import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";

export const runtime = "nodejs";
// alt is a static metadata export (cannot vary per locale); the visible image
// content below is localized. The name is the salient part of the description.
export const alt = `${siteConfig.name} - Mechatronics Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

// Read the catalog directly rather than via next-intl's request APIs, which
// require an HTTP request that isn't present during static image generation.
// Guards against an unresolved locale during build-time collection.
async function loadOgStrings(locale: string): Promise<{
  role: string;
  taglineLine1: string;
  taglineLine2: string;
}> {
  const safe = (routing.locales as readonly string[]).includes(locale)
    ? locale
    : routing.defaultLocale;
  const messages = (await import(`../../../messages/${safe}.json`)).default;
  return {
    role: messages.Common.role,
    taglineLine1: messages.Metadata.ogTaglineLine1,
    taglineLine2: messages.Metadata.ogTaglineLine2,
  };
}

// Loaded at module level: disk reads are cheap and the Node module cache keeps
// them warm across warm serverless invocations, eliminating a per-request
// Google Fonts fetch.
const fontBold = readFileSync(
  path.join(process.cwd(), "public/fonts/SpaceGrotesk-Bold.ttf"),
);
const fontRegular = readFileSync(
  path.join(process.cwd(), "public/fonts/SpaceGrotesk-Regular.ttf"),
);

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const strings = await loadOgStrings(locale);
  const role = strings.role.toUpperCase();
  const taglineLine1 = strings.taglineLine1;
  const taglineLine2 = strings.taglineLine2;
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
          {role}
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
            {taglineLine1}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#0c1a1a",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            {taglineLine2}
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
    .jpeg({ quality: 90, progressive: true })
    .toBuffer();

  return new Response(new Uint8Array(jpegBuffer), {
    headers: { "Content-Type": "image/jpeg" },
  });
}
