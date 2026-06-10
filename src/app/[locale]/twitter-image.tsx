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
export const size = { width: 1200, height: 675 };
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

  const png = new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#0c1a1a",
        display: "flex",
        fontFamily: "Space Grotesk",
      }}
    >
      {/* Portrait — starts at x=580, bleeds off right edge */}
      <div
        style={{
          position: "absolute",
          right: 0,
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

      {/* Gradient: solid until ~x=480, then fades to transparent by x=800 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 800,
          height: "100%",
          background:
            "linear-gradient(90deg, #0c1a1a 60%, rgba(12,26,26,0) 100%)",
          display: "flex",
        }}
      />

      {/* Text — 80px padding both sides → 520px text zone, name at 44px ends ~x=524 */}
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
            color: "#f0f0f0",
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
            marginBottom: 48,
          }}
        >
          {role}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 60,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#7ab8bb",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            {taglineLine1}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#7ab8bb",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            {taglineLine2}
          </div>
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#3d6e70",
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
