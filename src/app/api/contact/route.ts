import { createContactMessage } from "@/lib/firestore";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`contact:${ip}`);

  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; topic?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const name = (body.name ?? "").trim().slice(0, 120);
  const email = (body.email ?? "").trim().toLowerCase().slice(0, 255);
  const topic = (body.topic ?? "General").trim().slice(0, 60);
  const message = (body.message ?? "").trim().slice(0, 4000);

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return Response.json(
      {
        ok: false,
        error:
          "Please share your name, a valid email, and a short message (5+ characters).",
      },
      { status: 422 },
    );
  }

  try {
    await createContactMessage({ name, email, topic, message });
    return Response.json({
      ok: true,
      message: "Thanks—we'll get back to you within one business day.",
    });
  } catch {
    return Response.json(
      { ok: false, error: "Could not send your message. Please try again." },
      { status: 500 },
    );
  }
}
