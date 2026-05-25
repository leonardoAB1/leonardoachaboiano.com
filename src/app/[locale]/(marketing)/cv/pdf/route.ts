import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = join(
    process.cwd(),
    "public",
    "cv",
    "leonardo-acha-boiano-cv.pdf",
  );
  const buffer = await readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="CV_LEONARDO_ACHA_BOIANO.pdf"',
    },
  });
}
