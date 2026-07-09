import { setSessionCookie, isAdminConfigured, getAdminAuth } from "@/lib/auth";
import { getUserById } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { token?: string; user?: { id: string; email: string; fullName: string } };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Always verify the Firebase ID token server-side when Admin SDK is available.
  // Never accept raw user data from the client body.
  if (!isAdminConfigured()) {
    return Response.json(
      { ok: false, error: "Server authentication not configured." },
      { status: 503 }
    );
  }

  if (!body.token) {
    return Response.json({ ok: false, error: "Missing token." }, { status: 400 });
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(body.token);
    const user = await getUserById(decoded.uid);
    if (!user) {
      return Response.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    await setSessionCookie(body.token);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Invalid or expired token." }, { status: 401 });
  }
}
