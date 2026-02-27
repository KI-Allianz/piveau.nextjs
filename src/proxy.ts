import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, supportedLocales, SupportedLocales } from "./lib/lang";

const AUTH_DISABLED = process.env.AUTH_DISABLED === "true";
const PROTECTED_PATHS = ["dataset", "model", "catalogues", "favourites"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const segments = pathname.split("/").filter(Boolean);
  const localeInPath = segments[0];

  if (!SupportedLocales.includes(localeInPath as supportedLocales)) {
    let newSegments = [...segments];

    if (SupportedLocales.includes(newSegments[0] as supportedLocales)) {
    } else {
      newSegments = [defaultLocale, ...newSegments.slice(1)];
    }

    const newPath = `/${newSegments.join("/")}${req.nextUrl.search}`;
    return NextResponse.redirect(new URL(newPath, req.url));
  }

  // Authentication handling (Runs only for protected paths)
  const isProtected = PROTECTED_PATHS.some((path) => segments.includes(path));

  if (isProtected && !AUTH_DISABLED) {
    return (withAuth as any)(
      function cb(req: NextRequest) {
        return NextResponse.next();
      },
      {
        pages: { signIn: "/auth/signin" },
        callbacks: {
          authorized: ({ token }: { token: any }) => !!token,
        },
      },
    )(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon (favicon files)
     * - themes (theme assets)
     * - auth (authentication routes)
     * - sitemap.xml and robots.txt (SEO files)
     */
    "/((?!api|_next/static|_next/image|favicon|themes|auth|sitemap.xml|robots.txt).*)",
  ],
};
