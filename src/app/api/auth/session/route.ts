import { setSessionCookie, setUserCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { token?: string; user?: { id: string; email: string; fullName: string } };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  try {
    if (body.token) {
      await setSessionCookie(body.token);
    }
    if (body.user) {
      await setUserCookie(body.user);
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Failed to set session." }, { status: 500 });
  }
}
