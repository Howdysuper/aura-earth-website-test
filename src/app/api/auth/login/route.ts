import { setSessionCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`login:${ip}`);

  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!body.token || typeof body.token !== "string") {
    return Response.json({ ok: false, error: "Missing auth token." }, { status: 400 });
  }

  if (body.token.length > 1024) {
    return Response.json({ ok: false, error: "Invalid token format." }, { status: 400 });
  }

  try {
    await setSessionCookie(body.token);
    return Response.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Login failed. Please try again.";
    return Response.json({ ok: false, error: message }, { status: 401 });
  }
}
