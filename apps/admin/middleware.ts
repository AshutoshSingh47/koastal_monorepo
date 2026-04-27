import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login"];
const waitingRoute = "/waiting";

const INACTIVE_STATUSES = ["PENDING", "BLOCKED", "DEACTIVATED"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isWaiting = pathname.startsWith(waitingRoute);
  const isRoot = pathname === "/";

  if (!isProtected && !isPublic && !isWaiting && !isRoot) {
    return NextResponse.next();
  }

  const incomingCookie = request.headers.get("cookie") ?? "";

  let session = null;
  try {
    const res = await fetch("http://localhost:8080/api/auth/get-session", {
      headers: { cookie: incomingCookie },
    });
    const body = await res.text();
    if (res.ok) {
      session = body ? JSON.parse(body) : null;
    }
  } catch (err) {
    console.log("[middleware] get-session error ->", err);
  }

  // No session — send everyone to login
  if (!session) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userStatus: string = session.user?.status ?? "PENDING";
  const isInactive = INACTIVE_STATUSES.includes(userStatus);

  // Inactive users (PENDING or BLOCKED) — can only see /waiting
  if (isInactive) {
    if (isWaiting) return NextResponse.next();
    return NextResponse.redirect(new URL(waitingRoute, request.url));
  }

  // Active users — keep them out of /login, /waiting, and root
  if (isPublic || isWaiting || isRoot) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
