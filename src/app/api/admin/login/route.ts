import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminPassword,
} from "@/lib/adminAuth";

type LoginBody = {
  password?: string;
};

type AttemptRecord = {
  count: number;
  firstAttemptAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, AttemptRecord>();

function getClientIp(req: NextRequest): string {
  const header = req.headers.get("x-forwarded-for");
  if (!header) return "unknown";
  return header.split(",")[0]?.trim() || "unknown";
}

function registerFailedAttempt(key: string): number {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return 1;
  }

  const next = { ...entry, count: entry.count + 1 };
  attempts.set(key, next);
  return next.count;
}

function clearAttempts(key: string) {
  attempts.delete(key);
}

function isBlocked(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isBlocked(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: LoginBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const password = body.password?.trim();
  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  if (password !== getAdminPassword()) {
    const failedCount = registerFailedAttempt(ip);
    const status = failedCount >= MAX_ATTEMPTS ? 429 : 401;
    return NextResponse.json({ error: "Invalid password." }, { status });
  }

  clearAttempts(ip);

  const token = await createAdminSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
