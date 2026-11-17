// Server-only guard for the paid AI routes: session check + per-hour rate limit
import { NextRequest, NextResponse } from "next/server";

const HOUR = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

/** In-memory sliding window (per server instance — enough for a single Node process). */
function overLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < HOUR);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}

/** Validates the session cookie against the backend. */
async function sessionUser(req: NextRequest): Promise<{ id: number; role: string } | null> {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth_me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

interface GuardOptions {
  /** Requests per hour for a signed-in user. */
  limit: number;
  /** Requests per hour per IP for guests; omit to require sign-in. */
  guestLimit?: number;
  roles?: string[];
}

/** Returns an error response to send, or null when the request may proceed. */
export async function guardAi(req: NextRequest, route: string, { limit, guestLimit, roles }: GuardOptions) {
  const user = await sessionUser(req);

  if (!user) {
    if (guestLimit === undefined) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    if (overLimit(`${route}:ip:${ip}`, guestLimit)) return tooMany();
    return null;
  }

  if (roles && !roles.includes(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (overLimit(`${route}:user:${user.id}`, limit)) return tooMany();
  return null;
}

const tooMany = () =>
  NextResponse.json({ error: "Too many requests, please try again later" }, { status: 429 });

export const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
