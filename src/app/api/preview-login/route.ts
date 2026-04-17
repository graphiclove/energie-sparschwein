import { NextResponse } from "next/server";

const ACCESS_COOKIE = "site_access";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/");
  const expectedPassword = process.env.SITE_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  if (password !== expectedPassword) {
    const loginUrl = new URL("/preview", request.url);
    loginUrl.searchParams.set("error", "1");
    if (next.startsWith("/")) {
      loginUrl.searchParams.set("next", next);
    }
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(new URL(next.startsWith("/") ? next : "/", request.url));
  response.cookies.set(ACCESS_COOKIE, "granted", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
