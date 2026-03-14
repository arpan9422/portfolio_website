import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = (await req.json()) as {
      name: string;
      email: string;
      message: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "arpanagrawal552@gmail.com",
      replyTo: email,
      subject: `New message from ${name} — Portfolio Contact`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #f0f0f0; border-radius: 12px; border: 1px solid #222;">
          <h2 style="margin: 0 0 24px; font-size: 20px; color: #fff;">📩 New Contact Form Submission</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #888; width: 80px; vertical-align: top;">Name</td>
              <td style="padding: 10px 0; color: #fff; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; vertical-align: top;">Email</td>
              <td style="padding: 10px 0;">
                <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; color: #ddd; white-space: pre-wrap; line-height: 1.6;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
            </tr>
          </table>

          <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
          <p style="margin: 0; font-size: 12px; color: #555;">Sent from your portfolio contact form · Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
