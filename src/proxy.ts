import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getBasicAuthPassword, passwordsMatch } from "./lib/basicAuth";

// A shared password in front of the whole site (pages AND API routes, so nobody can run up our
// Google bills without it). Set SITE_PASSWORD in the hosting environment. When it isn't set,
// local development is open, but a production build refuses everything rather than going public by accident.
export function proxy(request: NextRequest) {
  const expected = process.env.SITE_PASSWORD;

  if (!expected) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return new NextResponse("This site is not open yet.", { status: 503 });
  }

  const given = getBasicAuthPassword(request.headers.get("authorization"));
  if (given !== null && passwordsMatch(given, expected)) return NextResponse.next();

  return new NextResponse("Password required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Sonnen Café London", charset="UTF-8"' },
  });
}

export const config = {
  // Everything except Next's own static files and the favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
