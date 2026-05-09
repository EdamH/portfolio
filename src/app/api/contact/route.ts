import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "edam.hamza@supcom.tn";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, _honey, _loadTime } = body;

    // Honeypot check — return 200 silently to fool bots
    if (_honey) {
      return NextResponse.json({ success: true });
    }

    // Time-based check — reject submissions < 2 seconds after page load
    if (_loadTime && Date.now() - _loadTime < 2000) {
      return NextResponse.json({ success: true });
    }

    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // Validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.name = "Name is required.";
    }

    if (!email || !validateEmail(email)) {
      errors.email = "A valid email is required.";
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length < 10
    ) {
      errors.message = "Message must be at least 10 characters.";
    }

    if (
      message &&
      typeof message === "string" &&
      message.trim().length > 5000
    ) {
      errors.message = "Message must be under 5,000 characters.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Send email via Resend
    const { error } = await getResend().emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      subject: subject
        ? `Portfolio: ${subject}`
        : `Portfolio contact from ${name.trim()}`,
      replyTo: email.trim(),
      text: [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        subject ? `Subject: ${subject.trim()}` : "",
        "",
        `Message:`,
        message.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
