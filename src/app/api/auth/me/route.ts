import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, user: null });
  }
  return Response.json({
    ok: true,
    user: { id: user.id, email: user.email, fullName: user.fullName },
  });
}
