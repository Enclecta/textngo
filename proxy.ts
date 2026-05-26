import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const lowerPathname = pathname.toLowerCase();

  if (pathname !== lowerPathname) {
    const url = new URL(`${lowerPathname}${search}`, request.url);
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
