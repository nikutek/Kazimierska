import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// RESEND_FROM: after verifying kazimierska.com in Resend, change to e.g. "Kazimierska <contact@kazimierska.com>"
// RESEND_TO:   after domain verification, change back to "pg.pasja@wp.pl"
const FROM = process.env.RESEND_FROM ?? "Kazimierska <onboarding@resend.dev>";
const TO = process.env.RESEND_TO ?? "pg.pasja@wp.pl";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `Message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
