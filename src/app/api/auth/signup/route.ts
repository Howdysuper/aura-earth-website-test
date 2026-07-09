import { signup, setSessionCookie } from "@/lib/auth";
import { isAdminConfigured, getAdminAuth } from "@/lib/firebase-admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`signup:${ip}`);

  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: { token?: string; email?: string; fullName?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Require a Firebase ID token — never trust a client-provided UID.
  if (!isAdminConfigured()) {
    return Response.json(
      { ok: false, error: "Server authentication not configured." },
      { status: 503 }
    );
  }

  if (!body.token) {
    return Response.json({ ok: false, error: "Missing authentication token." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";

  if (!email || !fullName) {
    return Response.json(
      { ok: false, error: "Missing required fields." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return Response.json(
      { ok: false, error: "Invalid email format." },
      { status: 400 }
    );
  }

  if (fullName.length > 100) {
    return Response.json(
      { ok: false, error: "Name is too long." },
      { status: 400 }
    );
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(body.token);
    const uid = decoded.uid;

    if (decoded.email && decoded.email.toLowerCase() !== email) {
      return Response.json(
        { ok: false, error: "Email does not match authenticated account." },
        { status: 400 }
      );
    }

    const user = await signup({ uid, email, fullName });
    await setSessionCookie(body.token);

    return Response.json({
      ok: true,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Sign up failed. Please try again.";
    return Response.json({ ok: false, error: message }, { status: 409 });
  }
}
