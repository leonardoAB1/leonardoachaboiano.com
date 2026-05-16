import { readFileSync } from "fs";
import { ImageResponse } from "next/og";
import path from "path";
import { siteConfig } from "@/lib/constants";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} - ${siteConfig.title}`;
export const size = { width: 1200, height: 675 };
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

  const portraitBuffer = readFileSync(path.join(process.cwd(), "public/portrait.jpg"));
  const portraitSrc = `data:image/jpeg;base64,${portraitBuffer.toString("base64")}`;

  return new ImageResponse(
    (
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
            MECHATRONICS ENGINEER
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 60,
            }}
          >
            <div
              style={{ fontSize: 22, color: "#7ab8bb", fontWeight: 400, lineHeight: 1.6 }}
            >
              I build the robots.
            </div>
            <div
              style={{ fontSize: 22, color: "#7ab8bb", fontWeight: 400, lineHeight: 1.6 }}
            >
              I&apos;m not one.
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
