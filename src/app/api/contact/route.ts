import { NextResponse } from "next/server";
import { z } from "zod/v4";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    // TODO: integrate email service (Resend, Nodemailer) when ready
    console.log("Contact form submission:", data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
