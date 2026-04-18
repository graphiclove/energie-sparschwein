import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "site_access";
const PREVIEW_PATH = "/preview";
const LOGIN_PATH = "/api/preview-login";

function isPublicPath(pathname: string) {
  return (
    pathname === PREVIEW_PATH ||
    pathname === LOGIN_PATH ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/favicon.") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  );
}

export function proxy(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword || isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (request.cookies.get(ACCESS_COOKIE)?.value === "granted") {
    return NextResponse.next();
  }

  const loginUrl = new URL(PREVIEW_PATH, request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|woff|woff2)$).*)"],
};
